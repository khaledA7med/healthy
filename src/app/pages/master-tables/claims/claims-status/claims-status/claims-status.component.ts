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
import { Observable, Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MasterTableService } from "src/app/core/services/master-table.service";
import {
  IBaseMasterTable,
  IGenericResponseType,
} from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { ClaimsStatusService } from "src/app/shared/services/master-tables/claims/claims-status.service";
import { claimsStatusCols } from "src/app/shared/app/grid/claimsStatusCols";
import {
  IClaimsStatus,
  IClaimsStatusData,
} from "src/app/shared/app/models/MasterTables/claims/i-claims-status";

@Component({
  selector: "app-claims-status",
  templateUrl: "./claims-status.component.html",
  styleUrls: ["./claims-status.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ClaimsStatusComponent implements OnInit, OnDestroy {
  lookupData!: Observable<IBaseMasterTable>;
  ClaimsStatusFormSubmitted = false as boolean;
  ClaimsStatusModal!: NgbModalRef;
  ClaimsStatusForm!: FormGroup<IClaimsStatus>;
  lineOfBussArr: IGenericResponseType[] = [];

  @ViewChild("ClaimsStatusContent") ClaimsStatusContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IClaimsStatus[],
    totalPages: 0,
    editClaimsStatusMode: false as Boolean,
    editClaimsStatusData: {} as IClaimsStatusData,
    status: "Active",
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: claimsStatusCols,
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

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.ClaimsStatusService.getClaimsStatus(
        this.uiState.status
      ).subscribe((res: HttpResponse<IBaseResponse<IClaimsStatus[]>>) => {
        if (res.body?.status) {
          this.uiState.list = res.body?.data!;
          params.successCallback(this.uiState.list, this.uiState.list.length);
          if (this.uiState.list.length === 0) this.gridApi.showNoRowsOverlay();
          else this.gridApi.hideOverlay();
        } else {
          this.message.popup("Oops!", res.body?.message!, "warning");
          this.gridApi.hideOverlay();
        }
      });
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
    private ClaimsStatusService: ClaimsStatusService,
    private message: MessagesService,
    private table: MasterTableService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initClaimsStatusForm();
    this.getLookupData();
    this.f.status?.patchValue(this.uiState.status);
  }

  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.ClaimsStatus);
  }

  DeleteClaimsStatus(sno: number) {
    let sub = this.ClaimsStatusService.DeleteClaimsStatus(sno).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) => {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  getClaimsStatusData(sno: number) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ClaimsStatusService.getEditClaimsStatusData(sno).subscribe(
      (res: HttpResponse<IBaseResponse<IClaimsStatusData>>) => {
        if (res.body?.status) {
          this.uiState.editClaimsStatusMode = true;
          this.uiState.editClaimsStatusData = res.body?.data!;
          this.fillEditClaimsStatusForm(res.body?.data!);
          this.eventService.broadcast(reserved.isLoading, false);
        } else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  openClaimsStatusDialoge(sno: number) {
    this.resetClaimsStatusForm();
    this.ClaimsStatusModal = this.modalService.open(this.ClaimsStatusContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });

    this.getClaimsStatusData(sno);

    this.ClaimsStatusModal.hidden.subscribe(() => {
      this.resetClaimsStatusForm();
      this.ClaimsStatusFormSubmitted = false;
      this.uiState.editClaimsStatusMode = false;
    });
  }

  initClaimsStatusForm() {
    this.ClaimsStatusForm = new FormGroup<IClaimsStatus>({
      sno: new FormControl(null),
      status: new FormControl("", Validators.required),
      claimNotes: new FormControl("", Validators.required),
    });
  }

  get f() {
    return this.ClaimsStatusForm.controls;
  }

  fillEditClaimsStatusForm(data: IClaimsStatusData) {
    this.f.status?.patchValue(data.status!);
    this.f.claimNotes?.patchValue(data.claimNotes!);
    this.f.status?.disable();
  }

  validationChecker(): boolean {
    if (this.ClaimsStatusForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  filter(e: any) {
    this.uiState.status = e?.name;
    this.gridApi.setDatasource(this.dataSource);
  }

  submitClaimsStatusData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IClaimsStatusData = {
      sno: this.uiState.editClaimsStatusMode
        ? this.uiState.editClaimsStatusData.sno
        : 0,
      status: formData.status,
      claimNotes: formData.claimNotes,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ClaimsStatusService.saveClaimsStatus(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.ClaimsStatusModal?.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
          this.uiState.submitted = false;
          this.resetClaimsStatusForm();
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.body?.message!, "success");
        } else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  resetClaimsStatusForm() {
    this.ClaimsStatusForm.reset();
    this.f.status?.enable();
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
