import { HttpResponse } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from "@angular/core";
import {
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  RowClickedEvent,
  RowDoubleClickedEvent,
} from "ag-grid-community";
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
        class="gridScrollbar"
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
    private message: MessagesService,
    private claimService: ClaimsService
  ) {}

  // Request Section
  requestDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.claimService
        .searchPolicy(this.filter)
        .subscribe((res: HttpResponse<IBaseResponse<IClaimPolicies[]>>) => {
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
        });
      this.subscribes.push(sub);
    },
  };

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridApi.showNoRowsOverlay();
  }

  onPageChange(params: GridReadyEvent) {
    if (this.gridReady)
      this.filter.pageNumber = this.gridApi.paginationGetCurrentPage() + 1;
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

  onRowClicked(e: RowDoubleClickedEvent) {
    this.dataEvent.emit(e.data);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
