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
  Caching,
  IBaseMasterTable,
  IGenericResponseType,
} from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
import {
  IQuotingRequirements,
  IQuotingRequirementsData,
  IQuotingRequirementsFilter,
} from "src/app/shared/app/models/MasterTables/business-development/sales/i-quoting-requirements";
import { quotingRequirementsCols } from "src/app/shared/app/grid/quotingRequirementsCols";
import { QuotingRequirementsService } from "src/app/shared/services/master-tables/business-development/sales/quoting-requirements.service";

@Component({
  selector: "app-quoting-requirements",
  templateUrl: "./quoting-requirements.component.html",
  styleUrls: ["./quoting-requirements.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class QuotingRequirementsComponent implements OnInit, OnDestroy {
  lookupData!: Observable<IBaseMasterTable>;
  QuotingRequirementsFormSubmitted = false as boolean;
  QuotingRequirementsModal!: NgbModalRef;
  QuotingRequirementsForm!: FormGroup<IQuotingRequirements>;
  lineOfBussArr: IGenericResponseType[] = [];

  @ViewChild("QuotingRequirementsContent")
  QuotingRequirementsContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: {
      itemsList: [] as IQuotingRequirementsFilter[],
    },
    totalPages: 0,
    editQuotingRequirementsMode: false as Boolean,
    editQuotingRequirementsData: {} as IQuotingRequirementsData,
  };
  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: quotingRequirementsCols,
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
      const data: {
        class: string;
        lineOfBusiness: string;
        insuranceCopmany: string;
      } = {
        class: this.f.class?.value!,
        lineOfBusiness: this.f.lineOfBusiness?.value!,
        insuranceCopmany: this.f.insuranceCopmany?.value!,
      };
      let sub = this.QuotingRequirementsService.getQuotingRequirements(
        data
      ).subscribe(
        (res: HttpResponse<IBaseResponse<IQuotingRequirementsFilter[]>>) => {
          if (res.body?.status) {
            this.uiState.list.itemsList = res.body?.data!;
            params.successCallback(
              this.uiState.list.itemsList,
              this.uiState.list.itemsList.length
            );
            if (this.uiState.list.itemsList.length === 0)
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

  constructor(
    private masterService: MasterMethodsService,
    private QuotingRequirementsService: QuotingRequirementsService,
    private message: MessagesService,
    private table: MasterTableService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initQuotingRequirementsForm();
    this.getLookupData();
  }

  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.QuotingRequirements);
  }

  getLineOfBusiness(className: string) {
    let sub = this.masterService
      .getLineOfBusiness(className)
      .subscribe(
        (res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>) => {
          if (res.body?.status) {
            this.lineOfBussArr = res.body?.data?.content!;
          } else this.message.toast(res.body?.message!, "error");
        }
      );
    this.subscribes.push(sub);
  }

  DeleteQuotingRequirements(id: string) {
    let sub = this.QuotingRequirementsService.DeleteQuotingRequirements(
      id
    ).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
      this.gridApi.setDatasource(this.dataSource);
      if (res.body?.status) this.message.toast(res.body!.message!, "success");
      else this.message.toast(res.body!.message!, "error");
    });
    this.subscribes.push(sub);
  }

  getQuotingRequirementsData(id: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.QuotingRequirementsService.getEditQuotingRequirements(
      id
    ).subscribe((res: IBaseResponse<IQuotingRequirementsData>) => {
      if (res?.status) {
        this.uiState.editQuotingRequirementsMode = true;
        this.uiState.editQuotingRequirementsData = res.data!;
        this.QuotingRequirementsForm.patchValue({
          ...this.uiState.editQuotingRequirementsData,
          defaultTick:
            this.uiState.editQuotingRequirementsData.defaultTick === 1
              ? true
              : false,
        });
        this.f.class?.disable();
        this.f.lineOfBusiness?.disable();
        this.f.insuranceCopmany?.disable();
        this.openQuotingRequirementsDialoge();
        this.eventService.broadcast(reserved.isLoading, false);
      } else this.message.toast(res.message!, "error");
    });
    this.subscribes.push(sub);
  }

  openQuotingRequirementsDialoge() {
    this.QuotingRequirementsModal = this.modalService.open(
      this.QuotingRequirementsContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "lg",
      }
    );

    this.QuotingRequirementsModal.hidden.subscribe(() => {
      this.resetQuotingRequirementsForm();
      this.QuotingRequirementsFormSubmitted = false;
      this.uiState.editQuotingRequirementsMode = false;
    });
  }

  initQuotingRequirementsForm() {
    this.QuotingRequirementsForm = new FormGroup<IQuotingRequirements>({
      sNo: new FormControl(0),
      item: new FormControl(null, Validators.required),
      itemArabic: new FormControl(null, Validators.required),
      description: new FormControl(null),
      descriptionArabic: new FormControl(null),
      defaultTick: new FormControl(false),
      class: new FormControl(null, Validators.required),
      lineOfBusiness: new FormControl(null, Validators.required),
      insuranceCopmany: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.QuotingRequirementsForm.controls;
  }

  validationChecker(): boolean {
    if (this.QuotingRequirementsForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitQuotingRequirementsData(form: FormGroup<IQuotingRequirements>) {
    this.uiState.submitted = true;

    // const formData = form.getRawValue();
    const data: IQuotingRequirementsData = {
      ...form.getRawValue(),
      defaultTick: form.getRawValue().defaultTick === true ? 1 : 0,
      sNo: this.uiState.editQuotingRequirementsMode
        ? this.uiState.editQuotingRequirementsData.sNo
        : 0,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);

    let sub = this.QuotingRequirementsService.saveQuotingRequirements(
      data
    ).subscribe((res: IBaseResponse<any>) => {
      if (res?.status) {
        if (this.uiState.editQuotingRequirementsMode) {
          this.QuotingRequirementsModal?.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
        } else this.resetQuotingRequirementsForm();

        this.gridApi.setDatasource(this.dataSource);
        this.message.toast(res?.message!, "success");
      } else this.message.popup("Sorry!", res.message!, "warning");
      this.eventService.broadcast(reserved.isLoading, false);
    });
    this.subscribes.push(sub);
  }

  resetQuotingRequirementsForm() {
    this.f.item?.reset();
    this.f.itemArabic?.reset();
    this.f.description?.reset();
    this.f.descriptionArabic?.reset();
    this.f.defaultTick?.reset();
    this.f.class?.enable();
    this.f.lineOfBusiness?.enable();
    this.f.insuranceCopmany?.enable();
    this.uiState.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
