import { HttpResponse } from "@angular/common/http";
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
import { Subscription } from "rxjs";
import { insuranceBrokersCols } from "src/app/shared/app/grid/insuranceBrokersCols";
import { InsuranceBrokersService } from "src/app/shared/services/master-tables/insurance-brokers.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  IInsuranceBrokers,
  IInsuranceBrokersData,
} from "src/app/shared/app/models/MasterTables/i-insurance-brokers";

@Component({
  selector: "app-insurance-brokers",
  templateUrl: "./insurance-brokers.component.html",
  styleUrls: ["./insurance-brokers.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceBrokersComponent implements OnInit, OnDestroy {
  InsuranceFormSubmitted = false as boolean;
  InsuranceModal!: NgbModalRef;
  InsuranceForm!: FormGroup<IInsuranceBrokers>;
  @ViewChild("insuranceContent") insuranceContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IInsuranceBrokers[],
    totalPages: 0,
    editInsuranceMode: false as Boolean,
    editInsuranceData: {} as IInsuranceBrokersData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: insuranceBrokersCols,
    suppressCsvExport: true,
    context: { comp: this },
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
    },
    overlayNoRowsTemplate:
      "<alert class='alert alert-secondary'>No Data To Show</alert>",
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
  };

  constructor(
    private InsuranceBrokersService: InsuranceBrokersService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initInsuranceForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.InsuranceBrokersService.getInsuranceBrokers().subscribe(
        (res: HttpResponse<IBaseResponse<IInsuranceBrokers[]>>) => {
          if (res.body?.status) {
            this.uiState.list = res.body?.data!;
            params.successCallback(this.uiState.list);
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

  openInsuranceDialoge(id?: string) {
    this.resetInsuranceForm();
    this.InsuranceModal = this.modalService.open(this.insuranceContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    if (id) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.InsuranceBrokersService.getEditInsuranceData(id).subscribe(
        (res: HttpResponse<IBaseResponse<IInsuranceBrokersData>>) => {
          if (res.body?.status) {
            this.uiState.editInsuranceMode = true;
            this.uiState.editInsuranceData = res.body?.data!;
            this.fillEditInsuranceForm(res.body?.data!);
            this.eventService.broadcast(reserved.isLoading, false);
          } else this.message.toast(res.body!.message!, "error");
        }
      );
      this.subscribes.push(sub);
    }

    this.InsuranceModal.hidden.subscribe(() => {
      this.resetInsuranceForm();
      this.InsuranceFormSubmitted = false;
      this.uiState.editInsuranceMode = false;
    });
  }

  initInsuranceForm() {
    this.InsuranceForm = new FormGroup<IInsuranceBrokers>({
      sno: new FormControl(null),
      companyName: new FormControl(null, Validators.required),
      mobileNo: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.InsuranceForm.controls;
  }

  fillEditInsuranceForm(data: IInsuranceBrokersData) {
    this.f.companyName?.patchValue(data.companyName!);
    this.f.mobileNo?.patchValue(data.mobileNo!);
    this.f.email?.patchValue(data.email!);
    this.f.address?.patchValue(data.address!);
  }

  validationChecker(): boolean {
    if (this.InsuranceForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitInsuranceData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IInsuranceBrokersData = {
      sno: this.uiState.editInsuranceMode
        ? this.uiState.editInsuranceData.sno
        : 0,
      companyName: formData.companyName,
      mobileNo: formData.mobileNo,
      email: formData.email,
      address: formData.address,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.InsuranceBrokersService.saveInsuranceBrokers(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.InsuranceModal.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
          this.uiState.submitted = false;
          this.resetInsuranceForm();
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.body?.message!, "success");
        } else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  resetInsuranceForm() {
    this.InsuranceForm.reset();
  }

  DeleteInsurance(id: string) {
    let sub = this.InsuranceBrokersService.DeleteInsurance(id).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) => {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
