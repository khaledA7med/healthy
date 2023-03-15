import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from 'rxjs';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { reserved } from 'src/app/core/models/reservedWord';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterTableService } from 'src/app/core/services/master-table.service';
import { IBaseMasterTable } from 'src/app/core/models/masterTableModels';
import { MODULES } from 'src/app/core/models/MODULES';
import { InsuranceWorkshopDetailsService } from 'src/app/shared/services/master-tables/claims/insurance-workshop-details.service';
import { insuranceWorkshopDetailsCols } from 'src/app/shared/app/grid/insuranceWorkshopDetailsCols';
import { IInsuranceWorkshopDetails, IInsuranceWorkshopDetailsData } from 'src/app/shared/app/models/MasterTables/claims/i-insurance-workshop-details';

@Component({
  selector: 'app-insurance-workshop-details',
  templateUrl: './insurance-workshop-details.component.html',
  styleUrls: [ './insurance-workshop-details.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceWorkshopDetailsComponent implements OnInit, OnDestroy
{

  lookupData!: Observable<IBaseMasterTable>;
  InsuranceWorkshopDetailsFormSubmitted = false as boolean;
  InsuranceWorkshopDetailsModal!: NgbModalRef;
  InsuranceWorkshopDetailsForm!: FormGroup<IInsuranceWorkshopDetails>;

  @ViewChild("InsuranceWorkshopDetailsContent") InsuranceWorkshopDetailsContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IInsuranceWorkshopDetails[],
    totalPages: 0,
    editInsuranceWorkshopDetailsMode: false as Boolean,
    editInsuranceWorkshopDetailsData: {} as IInsuranceWorkshopDetailsData,
    insuranceCompany: "Al Ahlia for Cooperative Insurance Company"

  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: insuranceWorkshopDetailsCols,
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

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.InsuranceWorkshopDetailsService.getInsuranceWorkshopDetails(this.uiState.insuranceCompany).subscribe(
        (res: HttpResponse<IBaseResponse<IInsuranceWorkshopDetails[]>>) =>
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

  constructor (
    private InsuranceWorkshopDetailsService: InsuranceWorkshopDetailsService,
    private message: MessagesService,
    private table: MasterTableService,
    private eventService: EventService,
    private modalService: NgbModal
  ) { }


  ngOnInit (): void
  {
    this.initInsuranceWorkshopDetailsForm();
    this.getLookupData();
  }

  getLookupData ()
  {
    this.lookupData = this.table.getBaseData(MODULES.InsuranceWorkshopDetails);
  }

  DeleteInsuranceWorkshopDetails (sno: number)
  {
    let sub = this.InsuranceWorkshopDetailsService.DeleteInsuranceWorkshopDetails(sno).subscribe(
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

  getInsuranceWorkshopDetailsData (sno: number)
  {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.InsuranceWorkshopDetailsService.getEditInsuranceWorkshopDetailsData(sno).subscribe(
      (res: HttpResponse<IBaseResponse<IInsuranceWorkshopDetailsData>>) =>
      {
        this.uiState.editInsuranceWorkshopDetailsMode = true;
        this.uiState.editInsuranceWorkshopDetailsData = res.body?.data!;
        this.fillEditInsuranceWorkshopDetailsForm(res.body?.data!);
        this.eventService.broadcast(reserved.isLoading, false);
      },
      (err: HttpErrorResponse) =>
      {
        this.message.popup("Oops!", err.message, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  openInsuranceWorkshopDetailsDialoge (sno: number)
  {
    this.resetInsuranceWorkshopDetailsForm();
    this.InsuranceWorkshopDetailsModal = this.modalService.open(this.InsuranceWorkshopDetailsContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "lg",
    });

    this.getInsuranceWorkshopDetailsData(sno);

    this.InsuranceWorkshopDetailsModal.hidden.subscribe(() =>
    {
      this.resetInsuranceWorkshopDetailsForm();
      this.InsuranceWorkshopDetailsFormSubmitted = false;
      this.uiState.editInsuranceWorkshopDetailsMode = false;
    });
  }

  initInsuranceWorkshopDetailsForm ()
  {
    this.InsuranceWorkshopDetailsForm = new FormGroup<IInsuranceWorkshopDetails>({
      sno: new FormControl(null),
      insuranceCompany: new FormControl("", Validators.required),
      workshopName: new FormControl("", Validators.required),
      city: new FormControl("", Validators.required),
      address: new FormControl(""),
      telephone: new FormControl(""),
      email: new FormControl(""),
    })
  }

  get f ()
  {
    return this.InsuranceWorkshopDetailsForm.controls;
  }

  fillAddInsuranceWorkshopDetailsForm (data: IInsuranceWorkshopDetailsData)
  {
    this.f.insuranceCompany?.patchValue(data.insuranceCompany!);
    this.f.workshopName?.patchValue(data.workshopName!);
    this.f.city?.patchValue(data.city!);
    this.f.address?.patchValue(data.address!);
    this.f.telephone?.patchValue(data.telephone!);
    this.f.email?.patchValue(data.email!);
  }

  fillEditInsuranceWorkshopDetailsForm (data: IInsuranceWorkshopDetailsData)
  {
    this.f.insuranceCompany?.patchValue(data.insuranceCompany!);
    this.f.city?.patchValue(data.city!);
    this.f.workshopName?.patchValue(data.workshopName!);
    this.f.address?.patchValue(data.address!);
    this.f.telephone?.patchValue(data.telephone!);
    this.f.email?.patchValue(data.email!);
    this.f.insuranceCompany?.disable();
    this.f.city?.disable();
  }

  validationChecker (): boolean
  {
    if (this.InsuranceWorkshopDetailsForm.invalid)
    {
      this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
      return false;
    }
    return true;
  }

  filter (e: any)
  {
    this.uiState.insuranceCompany = e?.name
    this.gridApi.setDatasource(this.dataSource);
  }

  submitInsuranceWorkshopDetailsData (form: FormGroup)
  {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IInsuranceWorkshopDetailsData = {
      sno: this.uiState.editInsuranceWorkshopDetailsMode ? this.uiState.editInsuranceWorkshopDetailsData.sno : 0,
      insuranceCompany: formData.insuranceCompany,
      workshopName: formData.workshopName,
      city: formData.city,
      address: formData.address,
      telephone: formData.telephone,
      email: formData.email,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.InsuranceWorkshopDetailsService.saveInsuranceWorkshopDetails(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        this.InsuranceWorkshopDetailsModal?.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetInsuranceWorkshopDetailsForm();
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

  resetInsuranceWorkshopDetailsForm ()
  {
    this.InsuranceWorkshopDetailsForm.reset();
    this.f.insuranceCompany?.enable();
    this.f.city?.enable();
  }

  ngOnDestroy (): void
  {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }

}
