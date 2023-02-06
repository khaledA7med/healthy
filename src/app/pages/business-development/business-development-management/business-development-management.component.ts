import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { Subscription, using } from "rxjs";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import {
  CellEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import PerfectScrollbar from "perfect-scrollbar";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IBusinessDevelopment } from "src/app/shared/app/models/BusinessDevelopment/ibusiness-development";
import { IBusinessDevelopmentFilters } from "src/app/shared/app/models/BusinessDevelopment/ibusiness-development-filters";
import { businessDevelopmentCols } from "src/app/shared/app/grid/businessDevelopmentCols";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { BusinessDevelopmentService } from "src/app/shared/services/business-development/business-development.service";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";
import { SalesLeadStatus } from "src/app/shared/app/models/BusinessDevelopment/business-development-status";
import { DragulaService } from "ng2-dragula";
import { SweetAlertResult } from "sweetalert2";

@Component({
  selector: "app-business-development-management",
  templateUrl: "./business-development-management.component.html",
  styleUrls: ["./business-development-management.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessDevelopmentManagementComponent
  implements OnInit, OnDestroy
{
  uiState = {
    view: "card",
    dragulaInit: "SALESLEADS",
    routerLink: {
      forms: AppRoutes.BusinessDevelopment.create,
    },
    gridReady: false,
    submitted: false,
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sNo",
      orderDir: "asc",
    } as IBusinessDevelopmentFilters,
    salesLead: {
      list: [] as IBusinessDevelopment[],
      totalPages: 0,
    },
  };

  cardLists = {
    pending: [] as IBusinessDevelopment[],
    waitingClient: [] as IBusinessDevelopment[],
    prospect: [] as IBusinessDevelopment[],
    confirmed: [] as IBusinessDevelopment[],
    quoting: [] as IBusinessDevelopment[],
    lost: [] as IBusinessDevelopment[],
  };

  // To Unsubscription
  subscribes: Subscription[] = [];
  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: businessDevelopmentCols,
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
  constructor(
    private businssDevelopmenService: BusinessDevelopmentService,
    private tableRef: ElementRef,
    private message: MessagesService,
    private dragulaService: DragulaService,
    private offcanvasService: NgbOffcanvas,
    private table: MasterTableService,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getCardData();
    this.draggableHandler();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.businssDevelopmenService
        .getAllSalesLeads(this.uiState.filters)
        .subscribe(
          (res: HttpResponse<IBaseResponse<IBusinessDevelopment[]>>) => {
            this.uiState.salesLead.totalPages = JSON.parse(
              res.headers.get("x-pagination")!
            ).TotalCount;

            this.uiState.salesLead.list = res.body?.data!;

            params.successCallback(
              this.uiState.salesLead.list,
              this.uiState.salesLead.totalPages
            );
            this.gridApi.hideOverlay();
            this.uiState.gridReady = true;
            this.cardsDataFiltering();
          },
          (err: HttpErrorResponse) => {
            this.message.popup("Oops!", err.message, "error");
          }
        );
      this.subscribes.push(sub);
    },
  };

  getCardData() {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.businssDevelopmenService
      .getAllSalesLeads(this.uiState.filters)
      .subscribe(
        (res: HttpResponse<IBaseResponse<IBusinessDevelopment[]>>) => {
          this.uiState.salesLead.totalPages = JSON.parse(
            res.headers.get("x-pagination")!
          ).TotalCount;
          this.uiState.salesLead.list = res.body?.data!;
          this.cardsDataFiltering();
          this.eventService.broadcast(reserved.isLoading, false);
        },
        (err: HttpErrorResponse) => {
          this.message.popup("Oops!", err.message, "error");
        }
      );
    this.subscribes.push(sub);
  }

  cardsDataFiltering() {
    this.cardLists = {
      confirmed: [],
      lost: [],
      prospect: [],
      pending: [],
      quoting: [],
      waitingClient: [],
    };
    this.uiState.salesLead.list.map((el) => {
      switch (el.status) {
        case SalesLeadStatus.Prospect:
          this.cardLists.prospect.push(el);
          break;
        case SalesLeadStatus.Confirmed:
          this.cardLists.confirmed.push(el);
          break;
        case SalesLeadStatus.Quoting:
          this.cardLists.quoting.push(el);
          break;
        case SalesLeadStatus.Lost:
          this.cardLists.lost.push(el);
          break;
        case SalesLeadStatus.PendingwithUnderwriting:
          this.cardLists.pending.push(el);
          break;
        case SalesLeadStatus.WaitingForClientFeedback:
          this.cardLists.waitingClient.push(el);
          break;
        default:
          break;
      }
    });
    console.log(this.cardLists);
  }

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

  draggableHandler(): void {
    this.dragulaService.createGroup(this.uiState.dragulaInit, {
      revertOnSpill: true,
    });
    let sub = this.dragulaService
      .dropModel(this.uiState.dragulaInit)
      .subscribe(({ item, target, source }) => {
        this.message
          .confirm(
            "Yes, Sure!",
            "Are You Sure To Change Status?!",
            "primary",
            "question"
          )
          .then((result: SweetAlertResult) => {
            if (result.isConfirmed) {
              this.changeStatus(item, target.id);
            } else {
              for (let [key, val] of Object.entries(this.cardLists)) {
                if (key === target.id) {
                  type ObjectKey = keyof typeof this.cardLists;
                  const propFrom = key as ObjectKey;
                  const propTo = source.id as ObjectKey;
                  this.cardLists[propFrom] = val.filter(
                    (e) => e.sNo !== item.sNo
                  );
                  this.cardLists[propTo].push(item);
                  this.cardLists[propTo].sort((a, b) => a.sNo! - b.sNo!);
                }
              }
            }
          });
      });
    this.subscribes.push(sub);
  }

  changeStatus(lead: IBusinessDevelopment, status: string): void {
    // lead.leadNo
    console.log({ lead, status });
  }

  openFilterOffcanvas() {}

  ngOnDestroy(): void {}
}
