import { ICompanyRequirementsFilter } from './../../../../../shared/app/models/MasterTables/customer-service/i-company-requirements-filter';
import { IAddCompanyRequirements, IAddCompanyRequirementsData } from './../../../../../shared/app/models/MasterTables/customer-service/i-company-requirements-form';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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

  @ViewChild("CompanyRequirementsContent") CompanyRequirementsContent!: ElementRef;

  uiState = {
    gridReady: false,
    submitted: false,
    lists: {
      itemsList: [] as ICompanyRequirementsFilter[],
    },
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
    overlayNoRowsTemplate: "<alert class='alert alert-secondary'>No Data To Show</alert>",
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
  };

  constructor (
    private masterService: MasterMethodsService,
    private message: MessagesService,
    private CompanyRequirementsService: CompanyRequirementsService,
    private eventService: EventService,
    private modalService: NgbModal,
    private table: MasterTableService,
  ) { }

  ngOnInit (): void
  {
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
      let sub = this.CompanyRequirementsService.getCompanyRequirements({ endorsType: this.f.endorsType?.value!, classofInsurance: this.f.classofInsurance?.value!, insuranceCompanyID: this.f.insuranceCompanyID?.value!, lineOfBusiness: this.f.lineOfBusiness?.value! }).subscribe(
        (res: HttpResponse<IBaseResponse<ICompanyRequirementsFilter[]>>) =>
        {
          if (res.body?.status)
          {
            this.uiState.lists.itemsList = res.body?.data!;
            params.successCallback(this.uiState.lists.itemsList, this.uiState.lists.itemsList.length);
            if (this.uiState.lists.itemsList.length === 0) this.gridApi.showNoRowsOverlay();
            else this.gridApi.hideOverlay();
          } else
          {
            this.uiState.gridReady = true;
            this.gridApi.hideOverlay();
          }
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
    // this.gridApi.setDatasource(this.dataSource);
    this.gridApi.sizeColumnsToFit();
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

  openCompanyRequirementsDialoge ()
  {
    if (this.f.classofInsurance?.valid && this.f.lineOfBusiness?.valid && this.f.endorsType?.valid && this.f.insuranceCompanyID?.valid)
    {
      this.uiState.submitted = false;
      this.CompanyRequirementsModal = this.modalService.open(this.CompanyRequirementsContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "lg",
      });

      this.CompanyRequirementsModal.hidden.subscribe(() =>
      {
        this.resetCompanyRequirementsForm();
      });
    } else
    {
      this.uiState.submitted = true;
    }
  }


  initCompanyRequirementsForm ()
  {
    this.CompanyRequirementsForm = new FormGroup<IAddCompanyRequirements>({
      sno: new FormControl(0),
      endorsType: new FormControl("", Validators.required),
      classofInsurance: new FormControl("", Validators.required),
      insuranceCompanyID: new FormControl(null, Validators.required),
      lineOfBusiness: new FormControl("", Validators.required),
      item: new FormControl("", Validators.required),
    })
  }

  //#get edit form controls
  get f ()
  {
    return this.CompanyRequirementsForm.controls;
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

  submitCompanyRequirementsData (form: FormGroup<IAddCompanyRequirements>)
  {
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    const data: IAddCompanyRequirementsData = {
      ...form.getRawValue(),
    };
    let sub = this.CompanyRequirementsService.saveCompanyRequirements(data).subscribe(
      (res: IBaseResponse<any>) =>
      {
        if (res.status)
        {
          this.CompanyRequirementsModal.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
          this.message.toast(res.message!, "success");
          this.gridApi.setDatasource(this.dataSource);
        } else this.message.popup("Sorry!", res.message!, "warning");
        // Hide Loader
        this.eventService.broadcast(reserved.isLoading, false);
      },
      (err) =>
      {
        this.eventService.broadcast(reserved.isLoading, false);
        this.message.popup("Sorry!", err.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  resetCompanyRequirementsForm ()
  {
    this.f.sno?.patchValue(0);
    this.f.item?.reset();
    this.uiState.editCompanyRequirementsMode = false;
    this.uiState.submitted = false;
  }

  DeleteCompanyRequirements (sno: number)
  {
    let sub = this.CompanyRequirementsService.DeleteCompanyRequirements(sno).subscribe(
      (res: IBaseResponse<any>) =>
      {
        this.gridApi.setDatasource(this.dataSource);
        if (res.status) this.message.toast(res.message!, "success");
        else this.message.toast(res.message!, "error");
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
