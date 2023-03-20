import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
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
import { businessActivityCols } from "src/app/shared/app/grid/businessActivityCols";
import { BusinessActivityService } from "src/app/shared/services/master-tables/business-activity.service";
import {
  IBusinessActivity,
  IBusinessActivityData,
} from "src/app/shared/app/models/MasterTables/i-business-activity";

@Component({
  selector: "app-business-activity",
  templateUrl: "./business-activity.component.html",
  styleUrls: ["./business-activity.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessActivityComponent implements OnInit, OnDestroy {
  BusinessActivityFormSubmitted = false as boolean;
  BusinessActivityModal!: NgbModalRef;
  BusinessActivityForm!: FormGroup<IBusinessActivity>;
  @ViewChild("BusinessActivityContent")
  BusinessActivityContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IBusinessActivity[],
    totalPages: 0,
    editBusinessActivityMode: false as Boolean,
    editBusinessActivityData: {} as IBusinessActivityData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: businessActivityCols,
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
    private BusinessActivityService: BusinessActivityService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initBusinessActivityForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.BusinessActivityService.getBusinessActivity().subscribe(
        (res: HttpResponse<IBaseResponse<IBusinessActivity[]>>) => {
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

  openBusinessActivityDialoge(id?: string) {
    this.resetBusinessActivityForm();
    this.BusinessActivityModal = this.modalService.open(
      this.BusinessActivityContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "md",
      }
    );
    if (id) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.BusinessActivityService.getEditBusinessActivity(
        id
      ).subscribe((res: HttpResponse<IBaseResponse<IBusinessActivityData>>) => {
        if (res.body?.status) {
          this.uiState.editBusinessActivityMode = true;
          this.uiState.editBusinessActivityData = res.body?.data!;
          this.fillAddBusinessActivityForm(res.body?.data!);
          this.eventService.broadcast(reserved.isLoading, false);
        } else this.message.toast(res.body!.message!, "error");
      });
      this.subscribes.push(sub);
    }

    this.BusinessActivityModal.hidden.subscribe(() => {
      this.resetBusinessActivityForm();
      this.BusinessActivityFormSubmitted = false;
      this.uiState.editBusinessActivityMode = false;
    });
  }

  initBusinessActivityForm() {
    this.BusinessActivityForm = new FormGroup<IBusinessActivity>({
      sno: new FormControl(null),
      businessActivity: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.BusinessActivityForm.controls;
  }

  fillAddBusinessActivityForm(data: IBusinessActivityData) {
    this.f.businessActivity?.patchValue(data.businessActivity!);
  }

  fillEditBusinessActivityForm(data: IBusinessActivityData) {
    this.f.businessActivity?.patchValue(data.businessActivity!);
  }

  validationChecker(): boolean {
    if (this.BusinessActivityForm.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  submitBusinessActivityData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IBusinessActivityData = {
      sno: this.uiState.editBusinessActivityMode
        ? this.uiState.editBusinessActivityData.sno
        : 0,
      businessActivity: formData.businessActivity,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.BusinessActivityService.saveBusinessActivity(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.BusinessActivityModal.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
          this.uiState.submitted = false;
          this.resetBusinessActivityForm();
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.body?.message!, "success");
        } else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  resetBusinessActivityForm() {
    this.BusinessActivityForm.reset();
  }

  DeleteBusinessActivity(id: string) {
    let sub = this.BusinessActivityService.DeleteBusinessActivity(id).subscribe(
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
