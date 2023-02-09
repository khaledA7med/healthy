import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
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
import {
  searchByClientCols,
  searchByRequestCols,
  searchPolicy,
} from "src/app/shared/app/grid/policyFormCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import {
  IPoliciesRef,
  IPolicyClient,
  IPolicyRequests,
} from "src/app/shared/app/models/Production/production-util";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";

@Component({
  selector: "app-policy-requests-list",
  template: `
    <div class="ag-theme-alpine" appTableView>
      <ag-grid-angular
        id="gridScrollbar"
        style="width: 100%; height: 75vh"
        [gridOptions]="gridOpts"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [],
})
export class PolicyRequestsListComponent implements OnDestroy, OnInit {
  @Input() filter!: any;
  @Input() type!: string;
  @Output() dataEvent: EventEmitter<any> = new EventEmitter();
  uiState = {
    requests: [] as IPolicyRequests[],
    clients: [] as IPolicyRequests[],
    policies: [] as IPolicyRequests[],
  };

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    pagination: false,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      resizable: true,
    },
    overlayNoRowsTemplate: "No Rows",
    onGridReady: (e) => this.onGridReady(e),
    onRowClicked: (e) => this.onRowClicked(e),
  };

  subscribes!: Subscription;

  constructor(
    private tableRef: ElementRef,
    private message: MessagesService,
    private productionService: ProductionService
  ) {}
  ngOnInit(): void {}

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.showNoRowsOverlay();
    if (this.type === "client") {
      this.gridOpts.api!.setColumnDefs(searchByClientCols);
    } else if (this.type === "request") {
      this.gridOpts.api!.setColumnDefs(searchByRequestCols);
    } else if (this.type === "policy") {
      this.gridOpts.api!.setColumnDefs(searchPolicy);
    }

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

  // Request Section
  requestDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.productionService
        .searchClientByRequest(this.filter)
        .subscribe(
          (res: IBaseResponse<IPolicyRequests[]>) => {
            if (res.status) {
              this.uiState.requests = res.data!;
              params.successCallback(
                this.uiState.requests,
                this.uiState.requests.length
              );
              if (this.uiState.requests.length === 0) {
                this.gridApi.showNoRowsOverlay();
              } else {
                this.gridApi.hideOverlay();
              }
            } else {
              this.message.popup("Oops!", res.message!, "warning");
              this.gridApi.hideOverlay();
            }
          },
          (err: HttpErrorResponse) => {
            this.gridApi.hideOverlay();
            this.message.popup("Oops!", err.message, "error");
          }
        );
      this.subscribes.add(sub);
    },
  };

  // Clients Section
  clientDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.productionService.searchForClient(this.filter).subscribe(
        (res: IBaseResponse<IPolicyClient[]>) => {
          if (res.status) {
            this.uiState.clients = res.data!;
            params.successCallback(
              this.uiState.clients,
              this.uiState.clients.length
            );

            if (this.uiState.clients.length === 0)
              this.gridApi.showNoRowsOverlay();
            else this.gridApi.hideOverlay();
          } else {
            this.message.popup("Oops!", res.message!, "warning");
            this.gridApi.hideOverlay();
          }
        },
        (err: HttpErrorResponse) => {
          this.gridApi.hideOverlay();
          this.message.popup("Oops!", err.message, "error");
        }
      );
      this.subscribes.add(sub);
    },
  };

  // Policies Section
  policyDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.productionService.searchForPolicy(this.filter).subscribe(
        (res: IBaseResponse<IPoliciesRef[]>) => {
          if (res.status) {
            this.uiState.policies = res.data!;
            params.successCallback(
              this.uiState.policies,
              this.uiState.policies.length
            );

            if (this.uiState.policies.length === 0)
              this.gridApi.showNoRowsOverlay();
            else this.gridApi.hideOverlay();
          } else {
            this.message.popup("Oops!", res.message!, "warning");
            this.gridApi.hideOverlay();
          }
        },
        (err: HttpErrorResponse) => {
          this.gridApi.hideOverlay();
          this.message.popup("Oops!", err.message, "error");
        }
      );
      this.subscribes.add(sub);
    },
  };

  setDataSource() {
    this.type === "client"
      ? this.gridApi.setDatasource(this.clientDataSource)
      : this.type === "request"
      ? this.gridApi.setDatasource(this.requestDataSource)
      : this.type === "policy"
      ? this.gridApi.setDatasource(this.policyDataSource)
      : "";
  }

  onRowClicked(e: RowClickedEvent) {
    this.dataEvent.emit(e.data);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.unsubscribe();
  }
}
