import { MessagesService } from "./../../../shared/services/messages.service";
import { ClaimsService } from "./../../../shared/services/claims/claims.service";
import { claimsManageCols } from "./../../../shared/app/grid/claimsCols";
import { IBaseFilters } from "./../../../shared/app/models/App/IBaseFilters";
import {
  Component,
  ElementRef,
  OnInit,
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
import { Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";

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
  constructor(
    private tableRef: ElementRef,
    private claimService: ClaimsService,
    private message: MessagesService
  ) {}

  ngOnInit(): void {}

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
}
