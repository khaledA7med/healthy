import {
  IComplaintTypes,
  IComplaintTypesData,
} from "src/app/shared/app/models/MasterTables/customer-service/i-complaint-types";
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
import { complaintsTypesCols } from "src/app/shared/app/grid/complaintTypesCols";
import { ComplaintTypesService } from "src/app/shared/services/master-tables/customer-service/complaint-types.service";

@Component({
  selector: "app-complaints-types",
  templateUrl: "./complaints-types.component.html",
  styleUrls: ["./complaints-types.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ComplaintsTypesComponent implements OnInit, OnDestroy {
  ComplaintsTypesFormSubmitted = false as boolean;
  ComplaintsTypesModal!: NgbModalRef;
  ComplaintsTypesForm!: FormGroup<IComplaintTypes>;
  @ViewChild("ComplaintsTypesContent")
  ComplaintsTypesContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IComplaintTypes[],
    totalPages: 0,
    editComplaintsTypesMode: false as Boolean,
    editComplaintsTypesData: {} as IComplaintTypesData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: complaintsTypesCols,
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
    private ComplaintTypesService: ComplaintTypesService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initComplaintsTypesForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.ComplaintTypesService.getComplaintTypes().subscribe(
        (res: HttpResponse<IBaseResponse<IComplaintTypes[]>>) => {
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

  openComplaintsTypeDialoge(sno?: number) {
    this.resetComplaintsTypesForm();
    this.ComplaintsTypesModal = this.modalService.open(
      this.ComplaintsTypesContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "md",
      }
    );
    if (sno) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.ComplaintTypesService.getEditComplaintTypes(sno).subscribe(
        (res: HttpResponse<IBaseResponse<IComplaintTypesData>>) => {
          if (res.body?.status) {
            this.uiState.editComplaintsTypesMode = true;
            this.uiState.editComplaintsTypesData = res.body?.data!;
            this.fillEditComplaintsTypesForm(res.body?.data!);
            this.eventService.broadcast(reserved.isLoading, false);
          } else this.message.toast(res.body!.message!, "error");
        }
      );
      this.subscribes.push(sub);
    }

    this.ComplaintsTypesModal.hidden.subscribe(() => {
      this.resetComplaintsTypesForm();
      this.ComplaintsTypesFormSubmitted = false;
      this.uiState.editComplaintsTypesMode = false;
    });
  }

  initComplaintsTypesForm() {
    this.ComplaintsTypesForm = new FormGroup<IComplaintTypes>({
      sno: new FormControl(null),
      type: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.ComplaintsTypesForm.controls;
  }

  fillEditComplaintsTypesForm(data: IComplaintTypesData) {
    this.f.type?.patchValue(data.type!);
  }

  validationChecker(): boolean {
    if (this.ComplaintsTypesForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitComplaintsTypesData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IComplaintTypesData = {
      sno: this.uiState.editComplaintsTypesMode
        ? this.uiState.editComplaintsTypesData.sno
        : 0,
      type: formData.type,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ComplaintTypesService.saveComplaintTypes(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.ComplaintsTypesModal.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
          this.uiState.submitted = false;
          this.resetComplaintsTypesForm();
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.body?.message!, "success");
        } else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  resetComplaintsTypesForm() {
    this.ComplaintsTypesForm.reset();
  }

  DeleteComplaintsTypes(sno: number) {
    let sub = this.ComplaintTypesService.DeleteComplaintTypes(sno).subscribe(
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
