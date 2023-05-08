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
import { complaintsSuspectiveCausesCols } from "src/app/shared/app/grid/complaintSuspectiveCausesCols";
import { ComplaintSuspectiveCausesService } from "src/app/shared/services/master-tables/customer-service/complaint-suspective-causes.service";
import {
  IComplaintSuspectiveCauses,
  IComplaintSuspectiveCausesData,
} from "src/app/shared/app/models/MasterTables/customer-service/i-complaint-suspective-causes";

@Component({
  selector: "app-complaints-suspective-causes",
  templateUrl: "./complaints-suspective-causes.component.html",
  styleUrls: ["./complaints-suspective-causes.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ComplaintsSuspectiveCausesComponent implements OnInit, OnDestroy {
  ComplaintsSuspectiveCausesFormSubmitted = false as boolean;
  ComplaintsSuspectiveCausesModal!: NgbModalRef;
  ComplaintsSuspectiveCausesForm!: FormGroup<IComplaintSuspectiveCauses>;
  @ViewChild("ComplaintsSuspectiveCausesContent")
  ComplaintsSuspectiveCausesContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IComplaintSuspectiveCauses[],
    totalPages: 0,
    editComplaintsSuspectiveCausesMode: false as Boolean,
    editComplaintsSuspectiveCausesData: {} as IComplaintSuspectiveCausesData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    rowSelection: "single",
    columnDefs: complaintsSuspectiveCausesCols,
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
    private ComplaintSuspectiveCausesService: ComplaintSuspectiveCausesService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initComplaintsSuspectiveCausesForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub =
        this.ComplaintSuspectiveCausesService.getComplaintSuspectiveCauses().subscribe(
          (res: HttpResponse<IBaseResponse<IComplaintSuspectiveCauses[]>>) => {
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

  openComplaintsSuspectiveCausesDialoge(sno?: number) {
    this.resetComplaintsSuspectiveCausesForm();
    this.ComplaintsSuspectiveCausesModal = this.modalService.open(
      this.ComplaintsSuspectiveCausesContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "md",
      }
    );
    if (sno) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub =
        this.ComplaintSuspectiveCausesService.getEditComplaintSuspectiveCauses(
          sno
        ).subscribe(
          (
            res: HttpResponse<IBaseResponse<IComplaintSuspectiveCausesData>>
          ) => {
            if (res.body?.status) {
              this.uiState.editComplaintsSuspectiveCausesMode = true;
              this.uiState.editComplaintsSuspectiveCausesData = res.body?.data!;
              this.fillEditComplaintsSuspectiveCausesForm(res.body?.data!);
              this.eventService.broadcast(reserved.isLoading, false);
            } else this.message.toast(res.body!.message!, "error");
          }
        );
      this.subscribes.push(sub);
    }

    this.ComplaintsSuspectiveCausesModal.hidden.subscribe(() => {
      this.resetComplaintsSuspectiveCausesForm();
      this.ComplaintsSuspectiveCausesFormSubmitted = false;
      this.uiState.editComplaintsSuspectiveCausesMode = false;
    });
  }

  initComplaintsSuspectiveCausesForm() {
    this.ComplaintsSuspectiveCausesForm =
      new FormGroup<IComplaintSuspectiveCauses>({
        sno: new FormControl(null),
        suspectiveCause: new FormControl(null, Validators.required),
      });
  }

  get f() {
    return this.ComplaintsSuspectiveCausesForm.controls;
  }

  fillEditComplaintsSuspectiveCausesForm(data: IComplaintSuspectiveCausesData) {
    this.f.suspectiveCause?.patchValue(data.suspectiveCause!);
  }

  validationChecker(): boolean {
    if (this.ComplaintsSuspectiveCausesForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitComplaintsSuspectiveCausesData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IComplaintSuspectiveCausesData = {
      sno: this.uiState.editComplaintsSuspectiveCausesMode
        ? this.uiState.editComplaintsSuspectiveCausesData.sno
        : 0,
      suspectiveCause: formData.suspectiveCause,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub =
      this.ComplaintSuspectiveCausesService.saveComplaintSuspectiveCauses(
        data
      ).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.ComplaintsSuspectiveCausesModal.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
          this.uiState.submitted = false;
          this.resetComplaintsSuspectiveCausesForm();
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.body?.message!, "success");
        } else this.message.toast(res.body!.message!, "error");
      });
    this.subscribes.push(sub);
  }

  resetComplaintsSuspectiveCausesForm() {
    this.ComplaintsSuspectiveCausesForm.reset();
  }

  DeleteComplaintsSuspectiveCauses(sno: number) {
    let sub =
      this.ComplaintSuspectiveCausesService.DeleteComplaintSuspectiveCauses(
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
