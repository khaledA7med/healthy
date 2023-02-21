import AppUtils from "src/app/shared/app/util";
import { IClaimsFilter } from "./../../../shared/app/models/Claims/iclaims-filter";
import { FormControl, FormGroup } from "@angular/forms";
import { MessagesService } from "./../../../shared/services/messages.service";
import { ClaimsService } from "./../../../shared/services/claims/claims.service";
import { claimsManageCols } from "./../../../shared/app/grid/claimsCols";
import { IBaseFilters } from "./../../../shared/app/models/App/IBaseFilters";
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { IClaims } from "src/app/shared/app/models/Claims/iclaims";
import {
  CellEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import PerfectScrollbar from "perfect-scrollbar";
import { Observable, Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { NgbDate, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";

@Component({
  selector: "app-claims-list",
  templateUrl: "./claims-list.component.html",
  styleUrls: ["./claims-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ClaimsListComponent implements OnInit {
  uiState = {
    routerLink: {
      forms: AppRoutes.Claims.create,
    },
    gridReady: false,
    submitted: false,
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sNo",
      orderDir: "asc",
    } as IBaseFilters,
    claims: {
      list: [] as IClaims[],
      subStatus: [] as string[],
      totalPages: 0,
    },
  };
  // Grid Definitions
  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: claimsManageCols,
    suppressCsvExport: true,
    paginationPageSize: this.uiState.filters.pageSize,
    cacheBlockSize: this.uiState.filters.pageSize,
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
  subscribes: Subscription[] = [];
  filterForm!: FormGroup<IClaimsFilter>;
  formData!: Observable<IBaseMasterTable>;
  constructor(
    private tableRef: ElementRef,
    private claimService: ClaimsService,
    private message: MessagesService,
    private offcanvasService: NgbOffcanvas,
    private table: MasterTableService,
    private util: AppUtils
  ) {}

  ngOnInit(): void {
    this.formData = this.table.getBaseData(MODULES.Claims);
  }

  //#region Table
  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();

      let sub = this.claimService.getAllClaims(this.uiState.filters).subscribe(
        (res: HttpResponse<IBaseResponse<IClaims[]>>) => {
          this.uiState.claims.totalPages = JSON.parse(
            res.headers.get("x-pagination")!
          ).TotalCount;

          this.uiState.claims.list = res.body?.data!;

          params.successCallback(
            this.uiState.claims.list,
            this.uiState.claims.totalPages
          );
          this.uiState.gridReady = true;
          this.gridApi.hideOverlay();
        },
        (err: HttpErrorResponse) => {
          this.message.popup("Oops!", err.message, "error");
        }
      );
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

    const agBodyHorizontalViewport: HTMLElement =
      this.tableRef.nativeElement.querySelector(
        "#gridScrollbar .ag-body-horizontal-scroll-viewport"
      );
    const agBodyViewport: HTMLElement =
      this.tableRef.nativeElement.querySelector(
        "#gridScrollbar .ag-body-viewport"
      );

    if (agBodyViewport) {
      const vertical = new PerfectScrollbar(agBodyViewport);
      vertical.update();
    }
    if (agBodyHorizontalViewport) {
      const horizontal = new PerfectScrollbar(agBodyHorizontalViewport);
      horizontal.update();
    }
  }
  //#endregion

  //#region filter
  openFilterCanvas(name: TemplateRef<any>) {
    this.offcanvasService.open(name, { position: "end" });
    this.initFilterForm();
  }

  private initFilterForm() {
    this.filterForm = new FormGroup<IClaimsFilter>({
      clientId: new FormControl(null),
      clientName: new FormControl(null),
      claimType: new FormControl([]),
      status: new FormControl([]),
      subStatus: new FormControl([]),
      dtpLossFrom: new FormControl(null),
      dtpLossTo: new FormControl(null),
      dtpCreatedOnFrom: new FormControl(null),
      dtpCreatedOnTo: new FormControl(null),
      combOperatorAmount: new FormControl(null),
      paidAmount1: new FormControl(null),
      paidAmount2: new FormControl(null),
      combOperatorUnderProcessingAmount: new FormControl(null),
      underProcesingAmount1: new FormControl(null),
      underProcesingAmount2: new FormControl(null),
      claimNo: new FormControl(null),
      insurCompClaimNo: new FormControl(null),
      blawbNo: new FormControl(null),
      policyNo: new FormControl(null),
      chassisNumber: new FormControl(null),
      policyCertificateNo: new FormControl(null),
      declarationNo: new FormControl(null),
    });
  }
  get filterF() {
    return this.filterForm.controls;
  }
  getSubStatus() {
    if (this.filterF.status?.value!.length == 0) {
      this.uiState.claims.subStatus = [];
      this.filterF.subStatus?.reset();
      return;
    }
    let sub = this.claimService
      .getSubStatus(this.filterF.status?.value!)
      .subscribe(
        (res: HttpResponse<IBaseResponse<string[]>>) => {
          this.uiState.claims.subStatus = res.body?.data!;
        },
        (err: HttpErrorResponse) => {
          this.message.popup("Oops!", err.message, "error");
        }
      );
    this.subscribes.push(sub);
  }
  // get accident / bill date range
  accidentDateRange(e: { from: NgbDate; to: NgbDate }) {
    this.filterF.dtpLossFrom?.patchValue(this.util.dateFormater(e.from));
    this.filterF.dtpLossTo?.patchValue(this.util.dateFormater(e.to));
  }
  //get Create on date range
  createOnDateRange(e: { from: NgbDate; to: NgbDate }) {
    this.filterF.dtpCreatedOnFrom?.patchValue(this.util.dateFormater(e.from));
    this.filterF.dtpCreatedOnTo?.patchValue(this.util.dateFormater(e.to));
  }
  // paid amount
  paidAmount1(e: any) {
    this.filterF.paidAmount1?.patchValue(e.target.value);
  }
  paidAmount2(e: any) {
    this.filterF.paidAmount2?.patchValue(e.target.value);
  }

  // under processing amount
  processingAmount1(e: any) {
    this.filterF.underProcesingAmount1?.patchValue(e.target.value);
  }
  processingAmount2(e: any) {
    this.filterF.underProcesingAmount2?.patchValue(e.target.value);
  }

  submitFilterForm() {
    this.uiState.filters = {
      ...this.uiState.filters,
      ...this.filterForm.value,
    };
    this.gridApi.setDatasource(this.dataSource);
  }
  //#endregion
}
