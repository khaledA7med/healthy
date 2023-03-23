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
import { companyRejectionReasonsCols } from "src/app/shared/app/grid/companyRejectionReasonsCols";
import { CompanyRejectionReasonsService } from "src/app/shared/services/master-tables/business-development/cancellation-rejection-reasons/company-rejection-reasons.service";
import {
  ICompanyRejectionReasons,
  ICompanyRejectionReasonsData,
} from "src/app/shared/app/models/MasterTables/business-development/cancellation-rejection-reasons/i-company-rejection-reasons";

@Component({
  selector: "app-company-rejection-reasons",
  templateUrl: "./company-rejection-reasons.component.html",
  styleUrls: ["./company-rejection-reasons.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CompanyRejectionReasonsComponent implements OnInit, OnDestroy {
  CompanyRejectionReasonsFormSubmitted = false as boolean;
  CompanyRejectionReasonsModal!: NgbModalRef;
  CompanyRejectionReasonsForm!: FormGroup<ICompanyRejectionReasons>;
  @ViewChild("CompanyRejectionReasonsContent")
  CompanyRejectionReasonsContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as ICompanyRejectionReasons[],
    totalPages: 0,
    editCompanyRejectionReasonsMode: false as Boolean,
    editCompanyRejectionReasonsData: {} as ICompanyRejectionReasonsData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: companyRejectionReasonsCols,
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
    private CompanyRejectionReasonsService: CompanyRejectionReasonsService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initCompanyRejectionReasonsForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub =
        this.CompanyRejectionReasonsService.getCompanyRejectionReasons().subscribe(
          (res: HttpResponse<IBaseResponse<ICompanyRejectionReasons[]>>) => {
            if (res.body?.status) {
              this.uiState.list = res.body?.data!;
              params.successCallback(
                this.uiState.list,
                this.uiState.list.length
              );
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

  openCompanyRejectionReasonsDialoge(id?: string) {
    this.resetCompanyRejectionReasonsForm();
    this.CompanyRejectionReasonsModal = this.modalService.open(
      this.CompanyRejectionReasonsContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "md",
      }
    );
    if (id) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub =
        this.CompanyRejectionReasonsService.getEditCompanyRejectionReasons(
          id
        ).subscribe(
          (res: HttpResponse<IBaseResponse<ICompanyRejectionReasonsData>>) => {
            if (res.body?.status) {
              this.uiState.editCompanyRejectionReasonsMode = true;
              this.uiState.editCompanyRejectionReasonsData = res.body?.data!;
              this.fillEditCompanyRejectionReasonsForm(res.body?.data!);
              this.eventService.broadcast(reserved.isLoading, false);
            } else this.message.toast(res.body!.message!, "error");
          }
        );
      this.subscribes.push(sub);
    }

    this.CompanyRejectionReasonsModal.hidden.subscribe(() => {
      this.resetCompanyRejectionReasonsForm();
      this.CompanyRejectionReasonsFormSubmitted = false;
      this.uiState.editCompanyRejectionReasonsMode = false;
    });
  }

  initCompanyRejectionReasonsForm() {
    this.CompanyRejectionReasonsForm = new FormGroup<ICompanyRejectionReasons>({
      sNo: new FormControl(null),
      reason: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.CompanyRejectionReasonsForm.controls;
  }

  fillEditCompanyRejectionReasonsForm(data: ICompanyRejectionReasonsData) {
    this.f.reason?.patchValue(data.reason!);
  }

  validationChecker(): boolean {
    if (this.CompanyRejectionReasonsForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitCompanyRejectionReasonsData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: ICompanyRejectionReasonsData = {
      sNo: this.uiState.editCompanyRejectionReasonsMode
        ? this.uiState.editCompanyRejectionReasonsData.sNo
        : 0,
      reason: formData.reason,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.CompanyRejectionReasonsService.saveCompanyRejectionReasons(
      data
    ).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
      if (res.body?.status) {
        this.CompanyRejectionReasonsModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetCompanyRejectionReasonsForm();
        this.gridApi.setDatasource(this.dataSource);
        this.message.toast(res.body?.message!, "success");
      } else this.message.toast(res.body!.message!, "error");
    });
    this.subscribes.push(sub);
  }

  resetCompanyRejectionReasonsForm() {
    this.CompanyRejectionReasonsForm.reset();
  }

  DeleteCompanyRejectionReasons(id: string) {
    let sub = this.CompanyRejectionReasonsService.DeleteCompanyRejectionReasons(
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
