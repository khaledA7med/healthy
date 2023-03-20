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
import { Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { prospectLossReasonsCols } from "src/app/shared/app/grid/prospectLossReasonsCols";
import { ProspectLossReasonsService } from "src/app/shared/services/master-tables/business-development/sales/prospect-loss-reasons.service";
import {
  IProspectLossReasons,
  IProspectLossReasonsData,
} from "src/app/shared/app/models/MasterTables/business-development/sales/i-prospect-loss-reasons";

@Component({
  selector: "app-prospect-loss-reasons",
  templateUrl: "./prospect-loss-reasons.component.html",
  styleUrls: ["./prospect-loss-reasons.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ProspectLossReasonsComponent implements OnInit, OnDestroy {
  ProspectLossReasonsFormSubmitted = false as boolean;
  ProspectLossReasonsModal!: NgbModalRef;
  ProspectLossReasonsForm!: FormGroup<IProspectLossReasons>;
  @ViewChild("ProspectLossReasonsContent")
  ProspectLossReasonsContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IProspectLossReasons[],
    totalPages: 0,
    editProspectLossReasonsMode: false as Boolean,
    editProspectLossReasonsData: {} as IProspectLossReasonsData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: prospectLossReasonsCols,
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
    private ProspectLossReasonsService: ProspectLossReasonsService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initProspectLossReasonsForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub =
        this.ProspectLossReasonsService.getProspectLossReasons().subscribe(
          (res: HttpResponse<IBaseResponse<IProspectLossReasons[]>>) => {
            if (res.body?.status) {
              this.uiState.list = res.body?.data!;
              params.successCallback(
                this.uiState.list,
                this.uiState.list.length
              );
              this.uiState.gridReady = true;
              this.gridApi.hideOverlay();
            } else this.message.popup("Sorry!", res.body?.message!, "warning");
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

  openProspectLossReasonsDialoge(id?: string) {
    this.resetProspectLossReasonsForm();
    this.ProspectLossReasonsModal = this.modalService.open(
      this.ProspectLossReasonsContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "md",
      }
    );
    if (id) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.ProspectLossReasonsService.getEditProspectLossReasons(
        id
      ).subscribe(
        (res: HttpResponse<IBaseResponse<IProspectLossReasonsData>>) => {
          if (res.body?.status) {
            this.uiState.editProspectLossReasonsMode = true;
            this.uiState.editProspectLossReasonsData = res.body?.data!;
            this.fillAddProspectLossReasonsForm(res.body?.data!);
            this.eventService.broadcast(reserved.isLoading, false);
          } else this.message.popup("Sorry!", res.body?.message!, "warning");
        }
      );
      this.subscribes.push(sub);
    }

    this.ProspectLossReasonsModal.hidden.subscribe(() => {
      this.resetProspectLossReasonsForm();
      this.ProspectLossReasonsFormSubmitted = false;
      this.uiState.editProspectLossReasonsMode = false;
    });
  }

  initProspectLossReasonsForm() {
    this.ProspectLossReasonsForm = new FormGroup<IProspectLossReasons>({
      sNo: new FormControl(null),
      reason: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.ProspectLossReasonsForm.controls;
  }

  fillAddProspectLossReasonsForm(data: IProspectLossReasonsData) {
    this.f.reason?.patchValue(data.reason!);
  }

  fillEditProspectLossReasonsForm(data: IProspectLossReasonsData) {
    this.f.reason?.patchValue(data.reason!);
  }

  validationChecker(): boolean {
    if (this.ProspectLossReasonsForm.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  submitProspectLossReasonsData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IProspectLossReasonsData = {
      sNo: this.uiState.editProspectLossReasonsMode
        ? this.uiState.editProspectLossReasonsData.sNo
        : 0,
      reason: formData.reason,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ProspectLossReasonsService.saveProspectLossReasons(
      data
    ).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
      if (res.body?.status) {
        this.ProspectLossReasonsModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetProspectLossReasonsForm();
        this.gridApi.setDatasource(this.dataSource);
        this.message.toast(res.body?.message!, "success");
      } else this.message.popup("Sorry!", res.body?.message!, "warning");
    });
    this.subscribes.push(sub);
  }

  resetProspectLossReasonsForm() {
    this.ProspectLossReasonsForm.reset();
  }

  DeleteProspectLossReasons(id: string) {
    let sub = this.ProspectLossReasonsService.DeleteProspectLossReasons(
      id
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
