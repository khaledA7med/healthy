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
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { policyTypesCols } from "src/app/shared/app/grid/policyTypesCols";
import { PolicyTypesService } from "src/app/shared/services/master-tables/policy-types.service";
import {
  IPolicyTypes,
  IPolicyTypesData,
} from "src/app/shared/app/models/MasterTables/i-policy-types";

@Component({
  selector: "app-policy-types",
  templateUrl: "./policy-types.component.html",
  styleUrls: ["./policy-types.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PolicyTypesComponent implements OnInit, OnDestroy {
  PolicyTypesFormSubmitted = false as boolean;
  PolicyTypesModal!: NgbModalRef;
  PolicyTypesForm!: FormGroup<IPolicyTypes>;
  @ViewChild("PolicyTypesContent") PolicyTypesContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IPolicyTypes[],
    totalPages: 0,
    editPolicyTypesMode: false as Boolean,
    editPolicyTypesData: {} as IPolicyTypesData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: policyTypesCols,
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

  constructor(
    private PolicyTypesService: PolicyTypesService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initpolicyTypesForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.PolicyTypesService.getPolicyTypes().subscribe(
        (res: HttpResponse<IBaseResponse<IPolicyTypes[]>>) => {
          if (res.body?.status) {
            this.uiState.list = res.body?.data!;
            params.successCallback(this.uiState.list, this.uiState.list.length);
            this.uiState.gridReady = true;
            this.gridApi.hideOverlay();
          } else this.message.toast(res.body!.message!, "error");
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

  openPolicyTypeDialoge(id?: string) {
    this.resetPolicyTypesForm();
    this.PolicyTypesModal = this.modalService.open(this.PolicyTypesContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    if (id) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.PolicyTypesService.getEditPolicyTypes(id).subscribe(
        (res: HttpResponse<IBaseResponse<IPolicyTypesData>>) => {
          if (res.body?.status) {
            this.uiState.editPolicyTypesMode = true;
            this.uiState.editPolicyTypesData = res.body?.data!;
            this.fillAddPolicyTypesForm(res.body?.data!);
            this.eventService.broadcast(reserved.isLoading, false);
          } else this.message.toast(res.body!.message!, "error");
        }
      );
      this.subscribes.push(sub);
    }

    this.PolicyTypesModal.hidden.subscribe(() => {
      this.resetPolicyTypesForm();
      this.PolicyTypesFormSubmitted = false;
      this.uiState.editPolicyTypesMode = false;
    });
  }

  initpolicyTypesForm() {
    this.PolicyTypesForm = new FormGroup<IPolicyTypes>({
      sno: new FormControl(null),
      policyType: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.PolicyTypesForm.controls;
  }

  fillAddPolicyTypesForm(data: IPolicyTypesData) {
    this.f.policyType?.patchValue(data.policyType!);
  }

  fillEditPolicyTypesForm(data: IPolicyTypesData) {
    this.f.policyType?.patchValue(data.policyType!);
  }

  validationChecker(): boolean {
    if (this.PolicyTypesForm.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  submitPolicyTypesData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IPolicyTypesData = {
      sno: this.uiState.editPolicyTypesMode
        ? this.uiState.editPolicyTypesData.sno
        : 0,
      policyType: formData.policyType,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.PolicyTypesService.savePolicyTypes(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.PolicyTypesModal.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
          this.uiState.submitted = false;
          this.resetPolicyTypesForm();
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.body?.message!, "success");
        } else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  resetPolicyTypesForm() {
    this.PolicyTypesForm.reset();
  }

  DeletePolicyTypes(id: string) {
    let sub = this.PolicyTypesService.DeletePolicyTypes(id).subscribe(
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
