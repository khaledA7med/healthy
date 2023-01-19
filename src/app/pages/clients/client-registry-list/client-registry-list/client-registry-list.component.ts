import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
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
import PerfectScrollbar from "perfect-scrollbar";
import { clientManageCols } from "src/app/shared/app/grid/clientCols";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { ClientsService } from "src/app/shared/services/clients/clients.service";
import { Subscription } from "rxjs";
import { IClient } from "src/app/shared/app/models/Clients/iclient";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IClientFilters } from "src/app/shared/app/models/Clients/iclientFilters";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { ClientFiltersComponent } from "../client-filters/client-filters.component";

@Component({
  selector: "app-client-registry-list",
  templateUrl: "./client-registry-list.component.html",
  styleUrls: ["./client-registry-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ClientRegistryListComponent implements OnInit, OnDestroy {
  uiState = {
    routerLink: { forms: AppRoutes.Client.clientForms },
    gridReady: false,
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sNo",
      orderDir: "asc",
    } as IClientFilters,
    clients: {
      list: [] as IClient[],
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
    columnDefs: clientManageCols,
    suppressCsvExport: true,
    paginationPageSize: this.uiState.filters.pageSize,
    cacheBlockSize: this.uiState.filters.pageSize,
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: true,
    },
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
    onSortChanged: (e) => this.onSort(e),
    onPaginationChanged: (e) => this.onPageChange(e),
  };

  subscribes: Subscription[] = [];
  constructor(
    private clientService: ClientsService,
    private tableRef: ElementRef,
    private message: MessagesService,
    private offcanvasService: NgbOffcanvas
  ) {}

  ngOnInit(): void {}

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();

      let sub = this.clientService
        .getAllClients(this.uiState.filters)
        .subscribe(
          (res: HttpResponse<IBaseResponse<IClient[]>>) => {
            this.uiState.clients.totalPages = JSON.parse(
              res.headers.get("x-pagination")!
            ).TotalCount;

            this.uiState.clients.list = res.body?.data!;

            params.successCallback(
              this.uiState.clients.list,
              this.uiState.clients.totalPages
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

  onClientFilters() {
    // form.values
    // this.uiState.filters = form.values
    this.gridApi.setDatasource(this.dataSource);
  }
  openFilterOffcanvas() {
    this.offcanvasService.open(ClientFiltersComponent, { position: "end" });
    // this.filterClint.nativeElement.openOffcanvas();
    // this.offcanvasService.open(this.filterClint, {
    //   position: "end",
    // });
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
