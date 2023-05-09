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
import { cancellationReasonsCols } from "src/app/shared/app/grid/CSCancellationReasonsCols";
import { CancellationReasonsService } from "src/app/shared/services/master-tables/customer-service/cancellation-reasons.service";
import {
  ICancellationReasons,
  ICancellationReasonsData,
} from "src/app/shared/app/models/MasterTables/customer-service/i-cancellation-reasons";

@Component({
  selector: "app-cancellation-reasons",
  templateUrl: "./cancellation-reasons.component.html",
  styleUrls: ["./cancellation-reasons.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CancellationReasonsComponent implements OnInit, OnDestroy {
  CancellationReasonsFormSubmitted = false as boolean;
  CancellationReasonsModal!: NgbModalRef;
  CancellationReasonsForm!: FormGroup<ICancellationReasons>;
  @ViewChild("CancellationReasonsContent")
  CancellationReasonsContent!: TemplateRef<any>;

  uiState = {
    isLoading: false as boolean,
    gridReady: false,
    submitted: false,
    list: [] as ICancellationReasons[],
    totalPages: 0,
    editCancellationReasonsMode: false as Boolean,
    editCancellationReasonsData: {} as ICancellationReasonsData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    rowSelection: "single",
    columnDefs: cancellationReasonsCols,
    suppressCsvExport: true,
    context: { comp: this },
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
    },
    overlayNoRowsTemplate:
      "<alert class='alert alert-secondary'>No data to showw</alert>",
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
  };

  constructor(
    private CancellationReasonsService: CancellationReasonsService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initCancellationReasonsForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub =
        this.CancellationReasonsService.getCancellationReasons().subscribe(
          (res: HttpResponse<IBaseResponse<ICancellationReasons[]>>) => {
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

  openCancellationReasonsDialoge(sno?: number) {
    this.resetCancellationReasonsForm();
    this.CancellationReasonsModal = this.modalService.open(
      this.CancellationReasonsContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "md",
      }
    );
    if (sno) {
      let sub = this.CancellationReasonsService.getEditCancellationReasons(
        sno
      ).subscribe(
        (res: HttpResponse<IBaseResponse<ICancellationReasonsData>>) => {
          if (res.body?.status) {
            this.uiState.editCancellationReasonsMode = true;
            this.uiState.editCancellationReasonsData = res.body?.data!;
            this.fillEditCancellationReasonsForm(res.body?.data!);
          } else this.message.toast(res.body!.message!, "error");
        }
      );
      this.subscribes.push(sub);
    }

    this.CancellationReasonsModal.hidden.subscribe(() => {
      this.resetCancellationReasonsForm();
      this.CancellationReasonsFormSubmitted = false;
      this.uiState.editCancellationReasonsMode = false;
    });
  }

  initCancellationReasonsForm() {
    this.CancellationReasonsForm = new FormGroup<ICancellationReasons>({
      sno: new FormControl(null),
      cancelReason: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.CancellationReasonsForm.controls;
  }

  fillEditCancellationReasonsForm(data: ICancellationReasonsData) {
    this.f.cancelReason?.patchValue(data.cancelReason!);
  }

  validationChecker(): boolean {
    if (this.CancellationReasonsForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitCancellationReasonsData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: ICancellationReasonsData = {
      sno: this.uiState.editCancellationReasonsMode
        ? this.uiState.editCancellationReasonsData.sno
        : 0,
      cancelReason: formData.cancelReason,
    };
    if (!this.validationChecker()) return;
    let sub = this.CancellationReasonsService.saveCancellationReasons(
      data
    ).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
      if (res.body?.status) {
        this.CancellationReasonsModal.dismiss();
        this.uiState.submitted = false;
        this.resetCancellationReasonsForm();
        this.gridApi.setDatasource(this.dataSource);
        this.message.toast(res.body?.message!, "success");
      } else this.message.toast(res.body!.message!, "error");
    });
    this.subscribes.push(sub);
  }

  resetCancellationReasonsForm() {
    this.CancellationReasonsForm.reset();
  }

  DeleteCancellationReasons(sno: number) {
    let sub = this.CancellationReasonsService.DeleteCancellationReasons(
      sno
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
