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
import { insuranceClassCols } from "src/app/shared/app/grid/insuranceClassCols";
import {
  IInsuranceClass,
  IInsuranceClassData,
} from "src/app/shared/app/models/MasterTables/i-insurance-class";
import { InsuranceClassesService } from "src/app/shared/services/master-tables/insurance-classes.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-insurance-classes",
  templateUrl: "./insurance-classes.component.html",
  styleUrls: ["./insurance-classes.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceClassesComponent implements OnInit, OnDestroy {
  InsuranceFormSubmitted = false as boolean;
  InsuranceModal!: NgbModalRef;
  InsuranceForm!: FormGroup<IInsuranceClass>;
  @ViewChild("insuranceContent") insuranceContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IInsuranceClass[],
    totalPages: 0,
    editInsuranceMode: false as Boolean,
    editInsuranceData: {} as IInsuranceClassData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: insuranceClassCols,
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

  ngOnInit(): void {
    this.initInsuranceForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.InsuranceClassesService.getInsuranceClasses().subscribe(
        (res: HttpResponse<IBaseResponse<IInsuranceClass[]>>) => {
          if (res.body?.status) {
            this.uiState.list = res.body?.data!;
            params.successCallback(this.uiState.list, this.uiState.list.length);
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

  constructor(
    private InsuranceClassesService: InsuranceClassesService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

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
      let sub = this.InsuranceClassesService.getEditInsuranceData(id).subscribe(
        (res: HttpResponse<IBaseResponse<IInsuranceClassData>>) => {
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
    this.InsuranceForm = new FormGroup<IInsuranceClass>({
      sNo: new FormControl(null),
      className: new FormControl(null, Validators.required),
      classNameAr: new FormControl(null),
      abbreviation: new FormControl(null, Validators.required),
      allowedToAccessInsuranceClasses: new FormControl(null),
    });
  }

  get f() {
    return this.InsuranceForm.controls;
  }

  fillAddIsnuranceForm(data: IInsuranceClassData) {
    this.f.className?.patchValue(data.className!);
    this.f.classNameAr?.patchValue(data.classNameAr!);
    this.f.abbreviation?.patchValue(data.abbreviation!);
  }

  fillEditInsuranceForm(data: IInsuranceClassData) {
    this.f.className?.patchValue(data.className!);
    this.f.classNameAr?.patchValue(data.classNameAr!);
    this.f.abbreviation?.patchValue(data.abbreviation!);
    this.f.className?.disable();
    this.f.classNameAr?.disable();
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
    const data: IInsuranceClassData = {
      sNo: this.uiState.editInsuranceMode
        ? this.uiState.editInsuranceData.sNo
        : 0,
      className: formData.className,
      classNameAr: formData.classNameAr,
      abbreviation: formData.abbreviation,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.InsuranceClassesService.saveInsuranceClass(data).subscribe(
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
    this.f.className?.enable();
    this.f.classNameAr?.enable();
  }

  DeleteInsurance(id: string, ClassName: string) {
    let sub = this.InsuranceClassesService.DeleteInsurance(
      id,
      ClassName
    ).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
      this.gridApi.setDatasource(this.dataSource);
      if (res.body?.status) this.message.toast(res.body!.message!, "success");
      else this.message.toast(res.body!.message!, "error");
    });
    this.subscribes.push(sub);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
