import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  CellEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { InsuranceWorkshopDetailsService } from "src/app/shared/services/master-tables/claims/insurance-workshop-details.service";
import { insuranceWorkshopDetailsCols } from "src/app/shared/app/grid/insuranceWorkshopDetailsCols";
import {
  IInsuranceWorkshopDetails,
  IInsuranceWorkshopDetailsData,
  IInsuranceWorkshopDetailsFilter,
} from "src/app/shared/app/models/MasterTables/claims/i-insurance-workshop-details";

@Component({
  selector: "app-insurance-workshop-details",
  templateUrl: "./insurance-workshop-details.component.html",
  styleUrls: ["./insurance-workshop-details.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceWorkshopDetailsComponent implements OnInit, OnDestroy {
  lookupData!: Observable<IBaseMasterTable>;
  InsuranceWorkshopDetailsFormSubmitted = false as boolean;
  InsuranceWorkshopDetailsModal!: NgbModalRef;
  InsuranceWorkshopDetailsForm!: FormGroup<IInsuranceWorkshopDetails>;

  @ViewChild("InsuranceWorkshopDetailsContent")
  InsuranceWorkshopDetailsContent!: TemplateRef<any>;

  uiState = {
    isLoading: false as boolean,
    gridReady: false,
    submitted: false,
    list: [] as IInsuranceWorkshopDetailsFilter[],
    totalPages: 0,
    editInsuranceWorkshopDetailsMode: false as Boolean,
    editInsuranceWorkshopDetailsData: {} as IInsuranceWorkshopDetailsData,
    insuranceCompany: "Al Ahlia for Cooperative Insurance Company",
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    rowSelection: "single",
    columnDefs: insuranceWorkshopDetailsCols,
    suppressCsvExport: true,
    context: { comp: this },
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
    },
    overlayNoRowsTemplate:
      "<alert class='alert alert-secondary'>No data to show</alert>",
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
  };

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub =
        this.InsuranceWorkshopDetailsService.getInsuranceWorkshopDetails({
          insuranceCompany: this.f.insuranceCompany?.value!,
        }).subscribe(
          (
            res: HttpResponse<IBaseResponse<IInsuranceWorkshopDetailsFilter[]>>
          ) => {
            if (res.body?.status) {
              this.uiState.list = res.body?.data!;
              params.successCallback(
                this.uiState.list,
                this.uiState.list.length
              );
              if (this.uiState.list.length === 0)
                this.gridApi.showNoRowsOverlay();
              else this.gridApi.hideOverlay();
            } else {
              this.message.popup("Oops!", res.body?.message!, "warning");
              this.gridApi.hideOverlay();
            }
          }
        );
      this.subscribes.push(sub);
    },
  };

  onCellClicked(params: CellEvent) {
    if (params.column.getColId() == "action") {
      params.api.getCellRendererInstances({
        rowNodes: [params.node],
        columns: [params.column],
      });
    }
  }

  onPageSizeChange() {
    this.gridApi.showLoadingOverlay();
    this.gridApi.setDatasource(this.dataSource);
  }

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridApi.setDatasource(this.dataSource);
    this.gridApi.sizeColumnsToFit();
  }

  constructor(
    private InsuranceWorkshopDetailsService: InsuranceWorkshopDetailsService,
    private message: MessagesService,
    private table: MasterTableService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initInsuranceWorkshopDetailsForm();
    this.getLookupData();
    // this.f.insuranceCompany?.patchValue(this.uiState.insuranceCompany);
  }

  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.InsuranceWorkshopDetails);
  }

  DeleteInsuranceWorkshopDetails(id: string) {
    let sub =
      this.InsuranceWorkshopDetailsService.DeleteInsuranceWorkshopDetails(
        id
      ).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      });
    this.subscribes.push(sub);
  }

  getInsuranceWorkshopDetailsData(id: string) {
    let sub =
      this.InsuranceWorkshopDetailsService.getEditInsuranceWorkshopDetailsData(
        id
      ).subscribe(
        (res: HttpResponse<IBaseResponse<IInsuranceWorkshopDetailsData>>) => {
          if (res.body?.status) {
            this.uiState.editInsuranceWorkshopDetailsMode = true;
            this.uiState.editInsuranceWorkshopDetailsData = res.body?.data!;
            this.InsuranceWorkshopDetailsForm.patchValue({
              sno: this.uiState.editInsuranceWorkshopDetailsData.sno!,
              city: this.uiState.editInsuranceWorkshopDetailsData.city!,
              workshopName:
                this.uiState.editInsuranceWorkshopDetailsData.workshopName!,
              address: this.uiState.editInsuranceWorkshopDetailsData.address!,
              telephone:
                this.uiState.editInsuranceWorkshopDetailsData.telephone!,
              email: this.uiState.editInsuranceWorkshopDetailsData.email!,
            });
            this.f.city?.disable();
            this.openInsuranceWorkshopDetailsDialoge();
          } else this.message.toast(res.body!.message!, "error");
        }
      );
    this.subscribes.push(sub);
  }

  openInsuranceWorkshopDetailsDialoge() {
    if (this.f.insuranceCompany?.valid) {
      this.InsuranceWorkshopDetailsModal = this.modalService.open(
        this.InsuranceWorkshopDetailsContent,
        {
          ariaLabelledBy: "modal-basic-title",
          centered: true,
          backdrop: "static",
          size: "lg",
        }
      );

      this.InsuranceWorkshopDetailsModal.hidden.subscribe(() => {
        this.resetInsuranceWorkshopDetailsForm();
      });
    } else this.uiState.submitted = true;
  }

  initInsuranceWorkshopDetailsForm() {
    this.InsuranceWorkshopDetailsForm =
      new FormGroup<IInsuranceWorkshopDetails>({
        sno: new FormControl(0),
        insuranceCompany: new FormControl("", Validators.required),
        workshopName: new FormControl("", Validators.required),
        city: new FormControl("", Validators.required),
        address: new FormControl(""),
        telephone: new FormControl(""),
        email: new FormControl("", Validators.email),
      });
  }

  get f() {
    return this.InsuranceWorkshopDetailsForm.controls;
  }

  fillEditInsuranceWorkshopDetailsForm(data: IInsuranceWorkshopDetailsData) {
    this.f.insuranceCompany?.patchValue(data.insuranceCompany!);
    this.f.city?.patchValue(data.city!);
    this.f.workshopName?.patchValue(data.workshopName!);
    this.f.address?.patchValue(data.address!);
    this.f.telephone?.patchValue(data.telephone!);
    this.f.email?.patchValue(data.email!);
    this.f.insuranceCompany?.disable();
    this.f.city?.disable();
  }

  validationChecker(): boolean {
    if (this.InsuranceWorkshopDetailsForm.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  submitInsuranceWorkshopDetailsData(
    form: FormGroup<IInsuranceWorkshopDetails>
  ) {
    this.uiState.submitted = true;
    if (!this.validationChecker()) return;
    const data: IInsuranceWorkshopDetailsData = {
      ...form.getRawValue(),
    };
    let sub = this.InsuranceWorkshopDetailsService.saveInsuranceWorkshopDetails(
      data
    ).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
      if (res.body?.status) {
        this.InsuranceWorkshopDetailsModal?.dismiss();
        this.uiState.submitted = false;
        this.resetInsuranceWorkshopDetailsForm();
        this.gridApi.setDatasource(this.dataSource);
        this.message.toast(res.body?.message!, "success");
      } else this.message.toast(res.body?.message!, "error");
    });
    this.subscribes.push(sub);
  }

  resetInsuranceWorkshopDetailsForm() {
    this.f.workshopName?.reset();
    this.f.telephone?.reset();
    this.f.email?.reset();
    this.f.address?.reset();
    this.f.city?.reset();
    this.f.insuranceCompany?.enable();
    this.f.city?.enable();
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
