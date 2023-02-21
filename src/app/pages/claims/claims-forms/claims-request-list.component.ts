import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import {
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  RowClickedEvent,
} from "ag-grid-community";
import PerfectScrollbar from "perfect-scrollbar";
import { Subscription } from "rxjs";
import { claimsPoliciesRequestCols } from "src/app/shared/app/grid/claimsFormCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import {
  IClaimPolicies,
  IClaimPoliciesSearch,
} from "src/app/shared/app/models/Claims/claims-util";
import { ClaimsService } from "src/app/shared/services/claims/claims.service";
import { MessagesService } from "src/app/shared/services/messages.service";

@Component({
  selector: "app-claims-request-list",
  template: `
    <div class="ag-theme-alpine" appTableView>
      <ag-grid-angular
        id="gridScrollbar"
        style="width: 100%; height: 70vh"
        [gridOptions]="gridOpts"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [],
})
export class ClaimsRequestListComponent implements OnDestroy {
  @Input() filter: IClaimPoliciesSearch = {
    pageNumber: 1,
    pageSize: 50,
    orderBy: "sNo",
    orderDir: "asc",
    classOfInsurance: "",
    clientName: "",
    insuranceCompany: "",
    lineOfBusiness: "",
    policyNo: "",
  };

  @Output() dataEvent: EventEmitter<any> = new EventEmitter();

  policies: IClaimPolicies[] = [];
  totalPages: number = 0;

  gridReady: boolean = false;
  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "infinite",
    editType: "fullRow",
    columnDefs: claimsPoliciesRequestCols,
    animateRows: true,
    paginationPageSize: this.filter.pageSize,
    cacheBlockSize: this.filter.pageSize,
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      resizable: true,
      sortable: true,
    },
    overlayNoRowsTemplate:
      "<alert class='alert alert-secondary'>No Data To Show</alert>",
    onGridReady: (e) => this.onGridReady(e),
    onPaginationChanged: (e) => this.onPageChange(e),
    onSortChanged: (e) => this.onSort(e),
    onRowClicked: (e) => this.onRowClicked(e),
  };

  subscribes: Subscription[] = [];
  constructor(
    private tableRef: ElementRef,
    private message: MessagesService,
    private claimService: ClaimsService
  ) {}

  // Request Section
  requestDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.claimService.searchPolicy(this.filter).subscribe(
        (res: HttpResponse<IBaseResponse<IClaimPolicies[]>>) => {
          if (res.body?.status) {
            this.policies = res.body?.data!;
            this.totalPages = JSON.parse(
              res.headers.get("x-pagination")!
            ).TotalCount;

            params.successCallback(this.policies, this.totalPages);
            if (this.policies.length === 0) this.gridApi.showNoRowsOverlay();
            else this.gridApi.hideOverlay();
          } else {
            this.message.popup("Oops!", res.body?.message!, "warning");
            this.gridApi.hideOverlay();
          }
          this.gridReady = true;
        },
        (err: HttpErrorResponse) => {
          this.gridApi.hideOverlay();
          this.message.popup("Oops!", err.message, "error");
        }
      );
      this.subscribes.push(sub);
    },
  };

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridApi.showNoRowsOverlay();

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

  onPageChange(params: GridReadyEvent) {
    if (this.gridReady) {
      this.filter.pageNumber = this.gridApi.paginationGetCurrentPage() + 1;
    }
  }

  onSort(e: GridReadyEvent) {
    let colState = e.columnApi.getColumnState();
    colState.forEach((el) => {
      if (el.sort) {
        this.filter.orderBy = el.colId!;
        this.filter.orderDir = el.sort!;
      }
    });
  }

  setDataSource() {
    this.gridApi.setDatasource(this.requestDataSource);
  }

  onRowClicked(e: RowClickedEvent) {
    this.dataEvent.emit(e.data);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
