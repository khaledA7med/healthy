import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ProductionService } from "src/app/shared/services/production/production.service";
import {
  NgbModal,
  NgbModalRef,
  NgbOffcanvas,
} from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { MessagesService } from "src/app/shared/services/messages.service";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import {
  CellEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { productionEditCommissionCols } from "src/app/shared/app/grid/productionEditCommissionsCols";
import AppUtils from "src/app/shared/app/util";
import { IEditCommissions } from "src/app/shared/app/models/Production/i-edit-commissions";
import { HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { IEditCommissionsFilter } from "src/app/shared/app/models/Production/i-edit-commission-filter";
import {
  IEditCommissionsForm,
  IEditCommissionsFormData,
} from "src/app/shared/app/models/Production/i-edit-commissions-forms";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";
import {
  IAddProducers,
  IAddProducersData,
} from "src/app/shared/app/models/Production/i-add-producers";
import { IEditCommissionsPreview } from "src/app/shared/app/models/Production/i-edit-commission-preview";

@Component({
  selector: "app-policies-edit-commissions",
  templateUrl: "./policies-edit-commissions.component.html",
  styleUrls: ["./policies-edit-commissions.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PoliciesEditCommissionsComponent implements OnInit, OnDestroy {
  submitted = false;
  subBtn: boolean = false;
  uiState = {
    gridReady: false,
    submitted: false,
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sNo",
      orderDir: "asc",
    } as IEditCommissionsFilter,
    editCommissions: {
      list: [] as IEditCommissions[],
      totalPages: 0,
    },
    producerCommission: {
      producers: [] as any,
      commissionTotals: {
        percentage: 0,
      },
    },
    editId: "",
    editUserMode: false as Boolean,
    editUserData: {} as IEditCommissionsFormData,
    producers: [] as any,
  };

  @ViewChild("filter") editCommissionFilter!: ElementRef;
  @ViewChild("edit") edit!: ElementRef;

  // Edit Form //
  editUserModal!: NgbModalRef;
  editForm!: FormGroup<IEditCommissionsForm>;
  editFormSubmitted = false as boolean;

  filterForms!: FormGroup;
  lookupData!: Observable<IBaseMasterTable>;

  // to unSubscribe //
  subscribes: Subscription[] = [];

  // Grid Definitions//
  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: productionEditCommissionCols,
    suppressCsvExport: true,
    paginationPageSize: this.uiState.filters.pageSize,
    cacheBlockSize: this.uiState.filters.pageSize,
    context: { comp: this },
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
    },
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
    onSortChanged: (e) => this.onSort(e),
    onPaginationChanged: (e) => this.onPageChange(e),
  };

  constructor(
    private modalService: NgbModal,
    private message: MessagesService,
    private productionService: ProductionService,
    private appUtils: AppUtils,
    private offcanvasService: NgbOffcanvas,
    private table: MasterTableService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.getLookupData();
    this.initForm();
  }

  // Table Section
  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();

      let sub = this.productionService
        .getEditCommission(this.uiState.filters)
        .subscribe((res: HttpResponse<IBaseResponse<IEditCommissions[]>>) => {
          this.uiState.editCommissions.totalPages = JSON.parse(
            res.headers.get("x-pagination")!
          ).TotalCount;

          this.uiState.editCommissions.list = res.body?.data!;

          params.successCallback(
            this.uiState.editCommissions.list,
            this.uiState.editCommissions.totalPages
          );
          this.uiState.gridReady = true;
          this.gridApi.hideOverlay();
        });
      this.subscribes.push(sub);
    },
  };

  onSort(e: GridReadyEvent) {
    let colState = e.columnApi.getColumnState();
    colState.forEach((el) => {
      if (el.sort) {
        this.uiState.filters.orderBy = el.colId!;
        this.uiState.filters.orderDir = el.sort!;
      }
    });
  }

  onCellClicked(params: CellEvent) {
    if (params.column.getColId() == "action") {
      params.api.getCellRendererInstances({
        rowNodes: [params.node],
        columns: [params.column],
      });
    }
  }

  onPageSizeChange() {
    this.gridApi.paginationSetPageSize(+this.uiState.filters.pageSize);
    this.gridOpts.cacheBlockSize = +this.uiState.filters.pageSize;
    this.gridApi.showLoadingOverlay();
    this.gridApi.setDatasource(this.dataSource);
  }

  onPageChange(params: GridReadyEvent) {
    if (this.uiState.gridReady) {
      this.uiState.filters.pageNumber =
        this.gridApi.paginationGetCurrentPage() + 1;
    }
  }

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridApi.setDatasource(this.dataSource);
    this.gridApi.sizeColumnsToFit();
  }

  //#region filter Section

  //open Filter Canvas
  openFilterOffcanvas(): void {
    this.offcanvasService.open(this.editCommissionFilter, { position: "end" });
  }

  //#init filter form
  private initFilterForm(): void {
    this.filterForms = new FormGroup({
      clientName: new FormControl(null),
      policyNumber: new FormControl(null),
      producer: new FormControl(null),
    });
  }

  //#get filter form controls
  get f() {
    return this.filterForms.controls;
  }

  //get LookUp Data
  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.EditCommission);
  }

  modifyFilterReq() {
    this.uiState.filters = {
      ...this.uiState.filters,
      ...this.filterForms.value,
    };
  }

  onEditCommissionsFilter(): void {
    this.modifyFilterReq();
    this.gridApi.setDatasource(this.dataSource);
  }

  clearFilter() {
    this.filterForms.reset();
  }
  //#endregion

  // Edit Form

  //get user Data
  getUserData(id: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.productionService
      .getUserData(id)
      .subscribe(
        (res: HttpResponse<IBaseResponse<IEditCommissionsPreview>>) => {
          this.fillEditForm(res.body?.data!);
          if (res.body?.data?.producer?.startsWith("Direct Business")) {
            this.ff.producerCommPerc?.disable();
          } else {
            this.ff.producerCommPerc?.enable();
          }
          this.eventService.broadcast(reserved.isLoading, false);
        }
      );
    this.subscribes.push(sub);
  }

  //open Edit Modal
  openEditForm(id: string): void {
    this.editUserModal = this.modalService.open(this.edit, {
      centered: true,
      backdrop: "static",
      size: "xl",
    });
    this.getUserData(id);

    this.editUserModal.hidden.subscribe(() => {
      this.submitted = false;
      this.uiState.editUserMode = false;
      this.editForm.reset();
      this.ff.producersCommissions?.clear();
    });
  }

  //check Validation
  validationChecker(): boolean {
    if (this.editForm.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  //#init edit form
  initForm(): void {
    this.editForm = new FormGroup<IEditCommissionsForm>({
      sNo: new FormControl(null),
      clientNo: new FormControl(null),
      producer: new FormControl("", Validators.required),
      clientName: new FormControl(""),
      accNo: new FormControl(""),
      policyNo: new FormControl(""),
      savedBy: new FormControl(""),
      className: new FormControl(""),
      lineOfBusiness: new FormControl(""),
      compCommPerc: new FormControl(""),
      producerCommPerc: new FormControl(""),
      periodFrom: new FormControl(null),
      periodTo: new FormControl(null),
      updatedBy: new FormControl(""),
      insurComp: new FormControl(""),

      producersCommissions: new FormArray<FormGroup<IAddProducers>>([]),
    });
  }

  //#get edit form controls
  get ff() {
    return this.editForm.controls;
  }

  //#producersCommissions Array
  get producersCommissionsArray(): FormArray {
    return this.editForm.get("producersCommissions") as FormArray;
  }

  //get producers Commissions Controls
  producersCommissionsControls(i: number, control: string): AbstractControl {
    return this.producersCommissionsArray.controls[i].get(control)!;
  }

  //add Producers Commissions
  addProducersCommissions(data?: IAddProducersData): void {
    if (this.ff.producersCommissions?.invalid) {
      this.ff.producersCommissions.markAllAsTouched();
      return;
    } else if (
      +this.uiState.producerCommission.commissionTotals.percentage >=
      +this.ff.producerCommPerc?.value!
    ) {
      this.message.popup("Oops!", "Can't add any more than total");
      return;
    } else {
      let producerCommission = new FormGroup<IAddProducers>({
        producer: new FormControl(data?.producer || null, Validators.required),
        percentage: new FormControl(data?.percentage || null, [
          Validators.max(100),
          Validators.min(0),
          Validators.required,
        ]),
      });

      this.ff.producersCommissions?.push(producerCommission);
      this.producersCommissionsArray.updateValueAndValidity();
      this.totalCommissionRow();
    }
  }

  //change percentages
  formListeners(e?: Event): void {
    const handler = {
      emitEvent: false,
      OnlySelf: true,
    };
    this.ff.producersCommissions?.controls.forEach((el) => {
      let sub = el.controls.percentage?.valueChanges.subscribe((elm) => {
        if (+elm! > +this.uiState.producerCommission.commissionTotals)
          el.controls.percentage?.patchValue(
            +this.ff.producerCommPerc?.value!,
            handler
          );
      });
      this.subscribes.push(sub!);
    });
    if (+this.ff.compCommPerc?.value! > 0) {
      if (+this.ff.compCommPerc?.value! > 100) {
        this.ff.compCommPerc?.patchValue("100");
        return;
      }
    }
    let elm = (e?.target as HTMLInputElement).value;
    if (+elm! > 100) {
      this.ff.producerCommPerc?.patchValue("100");
      return;
    }
    this.totalCommissionRow();
  }

  //Total Commissions
  totalCommissionRow() {
    const handler = {
      emitEvent: false,
      OnlySelf: true,
    };
    this.ff.producersCommissions?.controls.forEach((el) => {
      let sub1 = el.controls.percentage?.valueChanges.subscribe((elm) => {
        if (+elm! > +this.ff.producerCommPerc?.value!)
          el.controls.percentage?.patchValue(
            +this.ff.producerCommPerc?.value!,
            handler
          );
      });
      this.subscribes.push(sub1!);
    });
    let sub2 = this.producersCommissionsArray.valueChanges.subscribe((el) => {
      this.uiState.producerCommission.commissionTotals = {
        percentage: el.reduce(
          (prev: any, next: any) => +prev + +next.percentage,
          0
        ),
      };
    });
    this.subscribes.push(sub2);
  }

  //change Producers
  changeprod(e: any) {
    if (e.id <= 4) {
      this.ff.producerCommPerc?.disable();
    } else {
      this.ff.producerCommPerc?.enable();
    }
  }

  removeCommission(i: number) {
    this.producersCommissionsArray.removeAt(i);
  }

  //Fill edit form
  fillEditForm(data: IEditCommissionsPreview): void {
    this.editForm.patchValue({
      sNo: data?.sNo,
      clientName: data?.clientName,
      producer: data?.producer,
      accNo: data?.accNo,
      policyNo: data?.policyNo,
      savedBy: data?.savedBy,
      className: data?.className,
      lineOfBusiness: data?.lineOfBusiness,
      compCommPerc: data?.compCommPerc,
      producerCommPerc: data?.producerCommPerc,
    });
    this.totalCommissionRow();

    this.ff.periodFrom?.patchValue(
      this.appUtils.dateStructFormat(data?.periodFrom!) as any
    );
    this.ff.periodTo?.patchValue(
      this.appUtils.dateStructFormat(data?.periodTo!) as any
    );
    if (data?.producersCommissions) {
      data?.producersCommissions!.forEach((el) =>
        this.addProducersCommissions(el)
      );
    }

    this.ff.sNo?.disable();
    this.ff.clientName?.disable();
    this.ff.accNo?.disable();
    this.ff.policyNo?.disable();
    this.ff.savedBy?.disable();
    this.ff.className?.disable();
    this.ff.lineOfBusiness?.disable();
    this.ff.periodFrom?.disable();
    this.ff.periodTo?.disable();
    this.ff.producersCommissions?.disable();

    this.eventService.broadcast(reserved.isLoading, false);
  }

  //Dates
  periodFrom(e: any) {
    this.ff.periodFrom?.patchValue(e.gon);
  }
  periodTo(e: any) {
    this.ff.periodTo?.patchValue(e.gon);
  }

  //Submit Form
  submitEditForm() {
    this.uiState.submitted = true;
    const formData = new FormData();
    let val = this.editForm.getRawValue();
    formData.append("clientName", val.clientName!);
    formData.append("clientName", val.accNo!);
    formData.append("policyNo", val.policyNo!);
    formData.append("savedBy", val.savedBy!);
    formData.append("className", val.className!);
    formData.append("lineOfBusiness", val.lineOfBusiness!);
    formData.append("producer", val.producer!);
    formData.append("producerCommPerc", val.producerCommPerc!);
    formData.append("compCommPerc", val.compCommPerc!);
    formData.append("periodFrom", this.appUtils.dateFormater(val.periodFrom!));
    formData.append("periodTo", this.appUtils.dateFormater(val.periodTo!));
    let commissions = val.producersCommissions!;
    for (let i = 0; i < commissions.length; i++) {
      formData.append(
        `producersCommissions[${i}].producer`,
        commissions[i].producer!
      );
      formData.append(
        `producersCommissions[${i}].percentage`,
        commissions[i].percentage?.toString()! ?? ""
      );
    }
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.productionService
      .UpdatePolicyComissions(formData)
      .subscribe((res: HttpResponse<IBaseResponse<any>>) => {
        this.editUserModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetEditForm();
        this.gridApi.setDatasource(this.dataSource);
        this.message.toast(res.body?.message!, "success");
      });
    this.subscribes.push(sub);
  }

  //reset Edit Form
  resetEditForm(): void {
    this.editForm.reset();
    this.ff.producersCommissions?.clear();
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
