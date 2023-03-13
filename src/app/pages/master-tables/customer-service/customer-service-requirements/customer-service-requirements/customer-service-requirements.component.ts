import { ICompanyRequirementsFilter } from './../../../../../shared/app/models/MasterTables/customer-service/i-company-requirements-filter';
import { IAddCompanyRequirements, IAddCompanyRequirementsData } from './../../../../../shared/app/models/MasterTables/customer-service/i-company-requirements-form';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from 'rxjs';
import { Caching, IBaseMasterTable, IGenericResponseType } from 'src/app/core/models/masterTableModels';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { MasterMethodsService } from 'src/app/shared/services/master-methods.service';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { reserved } from 'src/app/core/models/reservedWord';
import { MasterTableService } from 'src/app/core/services/master-table.service';
import { MODULES } from 'src/app/core/models/MODULES';
import { ICompanyRequirements } from 'src/app/shared/app/models/MasterTables/customer-service/i-company-requirements';
import { CustomerServiceRequirementsCols } from 'src/app/shared/app/grid/companyRequirementsCols';
import { CompanyRequirementsService } from 'src/app/shared/services/master-tables/customer-service/company-requirements.service';

@Component({
  selector: 'app-customer-service-requirements',
  templateUrl: './customer-service-requirements.component.html',
  styleUrls: [ './customer-service-requirements.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerServiceRequirementsComponent implements OnInit, OnDestroy
{

  lookupData!: Observable<IBaseMasterTable>;
  subscribes: Subscription[] = [];
  lineOfBussArr: IGenericResponseType[] = [];
  CompanyRequirementsFormSubmitted = false as boolean;
  CompanyRequirementsModal!: NgbModalRef;
  CompanyRequirementsForm!: FormGroup<IAddCompanyRequirements>;
  CompanyRequirementsFilterForm!: FormGroup;

  @ViewChild("CompanyRequirementsFilter") CompanyRequirementsFilter!: ElementRef;
  @ViewChild("CompanyRequirementsContent") CompanyRequirementsContent!: ElementRef;

  uiState = {
    gridReady: false,
    submitted: false,
    filter: {} as ICompanyRequirementsFilter,
    list: [] as ICompanyRequirements[],
    totalPages: 0,
    editCompanyRequirementsMode: false as Boolean,
    editCompanyRequirementsData: {} as IAddCompanyRequirementsData,
  };

  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: CustomerServiceRequirementsCols,
    suppressCsvExport: true,
    context: { comp: this },
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
    },
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
  };

  constructor (
    private masterService: MasterMethodsService,
    private message: MessagesService,
    private CompanyRequirementsService: CompanyRequirementsService,
    private eventService: EventService,
    private tableRef: ElementRef,
    private offcanvasService: NgbOffcanvas,
    private modalService: NgbModal,
    private table: MasterTableService,
  ) { }

  ngOnInit (): void
  {
    this.initFilterForm();
    this.initCompanyRequirementsForm();
    this.getLookupData();
  }

  getLookupData ()
  {
    this.lookupData = this.table.getBaseData(MODULES.CustomerServiceCompanyRequirements);
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.CompanyRequirementsService.getCompanyRequirements(this.uiState.filter).subscribe(
        (res: HttpResponse<IBaseResponse<ICompanyRequirements[]>>) =>
        {
          this.uiState.list = res.body?.data!;
          params.successCallback(this.uiState.list, this.uiState.list.length);
          this.uiState.gridReady = true;
          this.gridApi.hideOverlay();
        },
        (err: HttpErrorResponse) =>
        {
          this.message.popup("Oops!", err.message, "error");
        }
      );
      this.subscribes.push(sub);
    },
  };

  onCellClicked (params: CellEvent)
  {
    if (params.column.getColId() == "action")
    {
      params.api.getCellRendererInstances({
        rowNodes: [ params.node ],
        columns: [ params.column ],
      });
    }
  }

  onPageSizeChange ()
  {
    this.gridApi.showLoadingOverlay();
    this.gridApi.setDatasource(this.dataSource);
  }

  onGridReady (param: GridReadyEvent)
  {
    this.gridApi = param.api;
    this.gridApi.setDatasource(this.dataSource);
    // this.gridApi.sizeColumnsToFit();
  }

  openFilterOffcanvas (): void
  {
    this.offcanvasService.open(this.CompanyRequirementsFilter, { position: "end" });
  }

  private initFilterForm (): void
  {
    this.CompanyRequirementsFilterForm = new FormGroup({
      endorsType: new FormControl(""),
      classofInsurance: new FormControl(""),
      lineOfBusiness: new FormControl(""),
      insuranceCompanyName: new FormControl(""),
      insuranceCompanyID: new FormControl("")
    });
  }

  modifyFilterReq ()
  {
    this.uiState.filter = {
      ...this.uiState.filter,
      ...this.CompanyRequirementsFilterForm.value,
    };
  }
  onCompanyRequirementsFilters (): void
  {
    this.modifyFilterReq();
    this.gridApi.setDatasource(this.dataSource);
  }

  clearFilter ()
  {
    this.CompanyRequirementsFilterForm.reset();
  }

  getLineOfBusiness (className: string)
  {
    let sub = this.masterService.getLineOfBusiness(className).subscribe(
      (res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>) =>
      {
        this.lineOfBussArr = res.body?.data?.content!;
      },
      (err) =>
      {
        this.message.popup("Sorry!", err.message!, "warning");
      }
    );
    this.subscribes.push(sub);
  }

  openCompanyRequirementsDialoge (id?: string)
  {
    this.resetCompanyRequirementsForm();
    this.CompanyRequirementsModal = this.modalService.open(this.CompanyRequirementsContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "lg",
    });
    // if (id)
    // {
    //   this.eventService.broadcast(reserved.isLoading, true);
    //   let sub = this.CompanyRequirementsService.getEditCompanyRequirementsData(id).subscribe(
    //     (res: HttpResponse<IBaseResponse<IAddCompanyRequirementsData>>) =>
    //     {
    //       this.uiState.editCompanyRequirementsMode = true;
    //       this.uiState.editCompanyRequirementsData = res.body?.data!;
    //       this.fillEditCompanyRequirementsForm(res.body?.data!);
    //       this.eventService.broadcast(reserved.isLoading, false);
    //     },
    //     (err: HttpErrorResponse) =>
    //     {
    //       this.message.popup("Oops!", err.message, "error");
    //       this.eventService.broadcast(reserved.isLoading, false);
    //     }
    //   );
    //   this.subscribes.push(sub);
    // }

    this.CompanyRequirementsModal.hidden.subscribe(() =>
    {
      this.resetCompanyRequirementsForm();
      this.CompanyRequirementsFormSubmitted = false;
      this.uiState.editCompanyRequirementsMode = false;
    });
  }

  initCompanyRequirementsForm ()
  {
    this.CompanyRequirementsForm = new FormGroup<IAddCompanyRequirements>({
      endorsType: new FormControl(null, Validators.required),
      classofInsurance: new FormControl(null, Validators.required),
      insuranceCompanyID: new FormControl(null),
      lineOfBusiness: new FormControl(null, Validators.required),
      insuranceCompanyName: new FormControl(null, Validators.required),
      item: new FormControl(null, Validators.required),
    })
  }

  //#get edit form controls
  get f ()
  {
    return this.CompanyRequirementsForm.controls;
  }

  fillAddCompanyRequirementsForm (data: IAddCompanyRequirementsData)
  {
    this.f.endorsType?.patchValue(data.endorsType!);
    this.f.classofInsurance?.patchValue(data.classofInsurance!);
    this.f.insuranceCompanyID?.patchValue(data.insuranceCompanyID!);
    this.f.insuranceCompanyName?.patchValue(data.insuranceCompanyName!);
    this.f.item?.patchValue(data.item!);
    this.f.lineOfBusiness?.patchValue(data.lineOfBusiness!);
  }

  fillEditCompanyRequirementsForm (data: IAddCompanyRequirementsData)
  {
    this.f.endorsType?.patchValue(data.endorsType!);
    this.f.classofInsurance?.patchValue(data.classofInsurance!);
    this.f.insuranceCompanyID?.patchValue(data.insuranceCompanyID!);
    this.f.insuranceCompanyName?.patchValue(data.insuranceCompanyName!);
    this.f.item?.patchValue(data.item!);
    this.f.lineOfBusiness?.patchValue(data.lineOfBusiness!);
  }

  validationChecker (): boolean
  {
    if (this.CompanyRequirementsForm.invalid)
    {
      this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
      return false;
    }
    return true;
  }

  submitCompanyRequirementsData (form: FormGroup)
  {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IAddCompanyRequirementsData = {
      // sNo: this.uiState.editInsuranceMode ? this.uiState.editInsuranceData.sNo : 0,
      endorsType: formData.endorsType,
      classofInsurance: formData.classofInsurance,
      insuranceCompanyID: formData.insuranceCompanyID,
      lineOfBusiness: formData.lineOfBusiness,
      item: formData.item
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.CompanyRequirementsService.saveCompanyRequirements(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        this.CompanyRequirementsModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetCompanyRequirementsForm();
        this.gridApi.setDatasource(this.dataSource);
        this.message.toast(res.body?.message!, "success");
      },
      (err: HttpErrorResponse) =>
      {
        this.message.popup("Oops!", err.error.message, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  resetCompanyRequirementsForm ()
  {
    this.CompanyRequirementsForm.reset();
  }

  DeleteCompanyRequirements (sno: number)
  {
    let sub = this.CompanyRequirementsService.DeleteCompanyRequirements(sno).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) =>
      {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      },
      (err: HttpErrorResponse) =>
      {
        this.message.popup("Oops!", err.message, "error");
      }
    );
    this.subscribes.push(sub);
  }

  ngOnDestroy (): void
  {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
