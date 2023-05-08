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
import { legalStatusCols } from "src/app/shared/app/grid/legalStatusCols";
import { LegalStatusService } from "src/app/shared/services/master-tables/legal-status.service";
import {
  ILegalStatus,
  ILegalStatusData,
} from "src/app/shared/app/models/MasterTables/i-legal-status";

@Component({
  selector: "app-legal-status",
  templateUrl: "./legal-status.component.html",
  styleUrls: ["./legal-status.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LegalStatusComponent implements OnInit, OnDestroy {
  LegalStatusFormSubmitted = false as boolean;
  LegalStatusModal!: NgbModalRef;
  LegalStatusForm!: FormGroup<ILegalStatus>;
  @ViewChild("LegalStatusContent") LegalStatusContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as ILegalStatus[],
    totalPages: 0,
    editLegalStatusMode: false as Boolean,
    editLegalStatusData: {} as ILegalStatusData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: legalStatusCols,
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

  constructor(
    private LegalStatusService: LegalStatusService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initLegalStatusForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.LegalStatusService.getLegalStatus().subscribe(
        (res: HttpResponse<IBaseResponse<ILegalStatus[]>>) => {
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

  openLegalStatusDialoge(id?: string) {
    this.resetLegalStatusForm();
    this.LegalStatusModal = this.modalService.open(this.LegalStatusContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    if (id) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.LegalStatusService.getEditLegalStatus(id).subscribe(
        (res: HttpResponse<IBaseResponse<ILegalStatusData>>) => {
          if (res.body?.status) {
            this.uiState.editLegalStatusMode = true;
            this.uiState.editLegalStatusData = res.body?.data!;
            this.fillEditLegalStatusForm(res.body?.data!);
            this.eventService.broadcast(reserved.isLoading, false);
          } else this.message.toast(res.body!.message!, "error");
        }
      );
      this.subscribes.push(sub);
    }

    this.LegalStatusModal.hidden.subscribe(() => {
      this.resetLegalStatusForm();
      this.LegalStatusFormSubmitted = false;
      this.uiState.editLegalStatusMode = false;
    });
  }

  initLegalStatusForm() {
    this.LegalStatusForm = new FormGroup<ILegalStatus>({
      sno: new FormControl(null),
      legalStatus: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.LegalStatusForm.controls;
  }

  fillEditLegalStatusForm(data: ILegalStatusData) {
    this.f.legalStatus?.patchValue(data.legalStatus!);
  }

  validationChecker(): boolean {
    if (this.LegalStatusForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitLegalStatusData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: ILegalStatusData = {
      sno: this.uiState.editLegalStatusMode
        ? this.uiState.editLegalStatusData.sno
        : 0,
      legalStatus: formData.legalStatus,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.LegalStatusService.saveLegalStatus(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.LegalStatusModal.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
          this.uiState.submitted = false;
          this.resetLegalStatusForm();
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.body?.message!, "success");
        } else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  resetLegalStatusForm() {
    this.LegalStatusForm.reset();
  }

  DeleteLegalStatus(id: string) {
    let sub = this.LegalStatusService.DeleteLegalStatus(id).subscribe(
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
