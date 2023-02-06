import { CustomerServiceService } from './../../../shared/services/customer-service/customer-service.service';
import
{
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup } from "@angular/forms";
import
{
  CellEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { Observable, Subscription } from "rxjs";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";

import PerfectScrollbar from "perfect-scrollbar";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { ICustomerServiceFilters } from "src/app/shared/app/models/CustomerService/icustomer-service-filter";
import { ICustomerService } from "src/app/shared/app/models/CustomerService/icustomer-service";
import { customerServiceManageCols } from "src/app/shared/app/grid/customerServiceCols";


@Component({
  selector: 'app-customer-service-list',
  templateUrl: './customer-service-list.component.html',
  styleUrls: [ './customer-service-list.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerServiceListComponent implements OnInit
{
  @ViewChild("filter") clintFilter!: ElementRef;
  uiState = {
    routerLink: { forms: AppRoutes.CustomerService.create },
    gridReady: false,
    submitted: false,
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "branch",
      orderDir: "asc",
    } as ICustomerServiceFilters,
    customerService: {
      list: [] as ICustomerService[],
      totalPages: 0,
    },
  };

  // filter form
  filterForm!: FormGroup;
  lookupData!: Observable<IBaseMasterTable>;
  // to unSubscribe
  subscribes: Subscription[] = [];
  // Grid Definitions
  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: customerServiceManageCols,
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

  constructor (
    private customerService: CustomerServiceService,
    private tableRef: ElementRef,
    private message: MessagesService,
    private offcanvasService: NgbOffcanvas,
    private table: MasterTableService,
    private router: Router
  ) { }

  ngOnInit (): void
  {
    this.initFilterForm();
    this.getLookupData();
    let sub = this.router.events.subscribe((evt) =>
    {
      if (evt instanceof NavigationEnd)
      {
        if (!evt.url.includes("details"))
        {
          if (this.router.getCurrentNavigation()?.extras.state![ "updated" ])
            this.gridApi.setDatasource(this.dataSource);
        }
      }
    });
    this.subscribes.push(sub);
  }

  // Table Section
  // Table Section
  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();

      let sub = this.customerService
        .getCustomerService(this.uiState.filters)
        .subscribe(
          (res: HttpResponse<IBaseResponse<ICustomerService[]>>) =>
          {
            this.uiState.customerService.totalPages = JSON.parse(
              res.headers.get("x-pagination")!
            ).TotalCount;

            this.uiState.customerService.list = res.body?.data!;

            params.successCallback(
              this.uiState.customerService.list,
              this.uiState.customerService.totalPages
            );
            this.uiState.gridReady = true;
            this.gridApi.hideOverlay();
          },
          (err: HttpErrorResponse) =>
          {
            this.message.popup("Oops!", err.message, "error");
          }
        );
      this.subscribes.push(sub);
    },
  };

  onSort (e: GridReadyEvent)
  {
    let colState = e.columnApi.getColumnState();
    colState.forEach((el) =>
    {
      if (el.sort)
      {
        this.uiState.filters.orderBy = el.colId!;
        this.uiState.filters.orderDir = el.sort!;
      }
    });
  }

  onCellClicked (params: CellEvent)
  {
    if (params.column.getColId() == "action")
    {
      params.api.getCellRendererInstances({
        rowNodes: [ params.node ],
        columns: [ params.column ],
      });
    }
  }

  onPageSizeChange ()
  {
    this.gridApi.paginationSetPageSize(+this.uiState.filters.pageSize);
    this.gridOpts.cacheBlockSize = +this.uiState.filters.pageSize;
    this.gridApi.showLoadingOverlay();
    this.gridApi.setDatasource(this.dataSource);
  }

  onPageChange (params: GridReadyEvent)
  {
    if (this.uiState.gridReady)
    {
      this.uiState.filters.pageNumber =
        this.gridApi.paginationGetCurrentPage() + 1;
    }
  }

  onGridReady (param: GridReadyEvent)
  {
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

    if (agBodyViewport)
    {
      const vertical = new PerfectScrollbar(agBodyViewport);
      vertical.update();
    }
    if (agBodyHorizontalViewport)
    {
      const horizontal = new PerfectScrollbar(agBodyHorizontalViewport);
      horizontal.update();
    }
  }

  //  filter Section
  openFilterOffcanvas (): void
  {
    this.offcanvasService.open(this.clintFilter, { position: "end" });
  }
  private initFilterForm (): void
  {
    this.filterForm = new FormGroup({
      client: new FormControl(""),
      status: new FormControl([]),
      type: new FormControl(""),
      requestNo: new FormControl(""),
      branch: new FormControl(""),
      insuranceCompany: new FormControl(""),
      pendingReason: new FormControl(""),
      classOfBusniess: new FormControl(""),
      createdBy: new FormControl(""),
      deadline: new FormControl(""),
      duration: new FormControl(""),
    });
  }
  getLookupData ()
  {
    this.lookupData = this.table.getBaseData(MODULES.Client);
  }
  modifyFilterReq ()
  {
    this.uiState.filters = {
      ...this.uiState.filters,
      ...this.filterForm.value,
    };
  }
  onClientFilters (): void
  {
    this.modifyFilterReq();
    this.gridApi.setDatasource(this.dataSource);
  }

  clearFilter ()
  {
    this.filterForm.reset();
  }

  ngOnDestroy (): void
  {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }

}
