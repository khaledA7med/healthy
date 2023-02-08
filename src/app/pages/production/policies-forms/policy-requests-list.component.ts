import { Component, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  RowClickedEvent,
} from "ag-grid-community";
import PerfectScrollbar from "perfect-scrollbar";
import {
  searchByClientCols,
  searchByRequestCols,
} from "src/app/shared/app/grid/policyFormCols";
import { IPolicyRequests } from "src/app/shared/app/models/Production/production-util";
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
  uiState = {
    requests: [] as IPolicyRequests[],
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
    },
    onGridReady: (e) => this.onGridReady(e),
    onRowClicked: (e) => this.onRowClicked(e),
  };

  constructor(
    private tableRef: ElementRef,
    private message: MessagesService,
    private productionService: ProductionService
  ) {}
  ngOnInit(): void {}

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridApi.sizeColumnsToFit();

    if (this.type === "client") {
      this.gridOpts.api!.setColumnDefs(searchByClientCols);
      this.gridApi.setDatasource(this.clientDataSource);
    } else if (this.type === "request") {
      this.gridOpts.api!.setColumnDefs(searchByRequestCols);
      this.gridApi.setDatasource(this.requestDataSource);
    } else if (this.type === "policy") {
      this.gridApi.setDatasource(this.policyDataSource);
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

  requestDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      // this.uiState.requests = [
      //   {
      //     clientID: "123",
      //     clientName: "sdfgdsfg",
      //     requestNo: "sadfsadf",
      //     policyNo: "safasdf",
      //     classOfBusiness: "sadfasdf",
      //     lineOfBusiness: "sadfsadf",
      //     producer: "asdfasdf",
      //     endorsType: "sdsadfsdf",
      //   },
      // ];
      // this.gridApi.showLoadingOverlay();
      // let sub = this.productionService
      //   .getAllClients(this.uiState.filters)
      //   .subscribe(
      //     (res: HttpResponse<IBaseResponse<IPolicyRequests[]>>) => {
      //       // this.uiState.clients.list = res.body?.data!;
      //       // params.successCallback(
      //       //   this.uiState.clients.list,
      //       //   this.uiState.clients.totalPages
      //       // );
      //       this.gridApi.hideOverlay();
      //     },
      //     (err: HttpErrorResponse) => {
      //       this.message.popup("Oops!", err.message, "error");
      //     }
      //   );
      // this.subscribes.push(sub);
      params.successCallback(
        this.uiState.requests,
        this.uiState.requests.length
      );
    },
  };

  clientDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      // this.uiState.requests = [
      //   {
      //     clientID: "123",
      //     clientName: "sdfgdsfg",
      //     requestNo: "sadfsadf",
      //     policyNo: "safasdf",
      //     classOfBusiness: "sadfasdf",
      //     lineOfBusiness: "sadfsadf",
      //     producer: "asdfasdf",
      //     endorsType: "sdsadfsdf",
      //   },
      // ];
      // this.gridApi.showLoadingOverlay();
      // let sub = this.productionService
      //   .getAllClients(this.uiState.filters)
      //   .subscribe(
      //     (res: HttpResponse<IBaseResponse<IPolicyRequests[]>>) => {
      //       // this.uiState.clients.list = res.body?.data!;
      //       // params.successCallback(
      //       //   this.uiState.clients.list,
      //       //   this.uiState.clients.totalPages
      //       // );
      //       this.gridApi.hideOverlay();
      //     },
      //     (err: HttpErrorResponse) => {
      //       this.message.popup("Oops!", err.message, "error");
      //     }
      //   );
      // this.subscribes.push(sub);
      params.successCallback(
        this.uiState.requests,
        this.uiState.requests.length
      );
    },
  };

  // Policies Section
  policyDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      // this.uiState.requests = [
      //   {
      //     clientID: "123",
      //     clientName: "sdfgdsfg",
      //     requestNo: "sadfsadf",
      //     policyNo: "safasdf",
      //     classOfBusiness: "sadfasdf",
      //     lineOfBusiness: "sadfsadf",
      //     producer: "asdfasdf",
      //     endorsType: "sdsadfsdf",
      //   },
      // ];
      // this.gridApi.showLoadingOverlay();
      // let sub = this.productionService
      //   .getAllClients(this.uiState.filters)
      //   .subscribe(
      //     (res: HttpResponse<IBaseResponse<IPolicyRequests[]>>) => {
      //       // this.uiState.clients.list = res.body?.data!;
      //       // params.successCallback(
      //       //   this.uiState.clients.list,
      //       //   this.uiState.clients.totalPages
      //       // );
      //       this.gridApi.hideOverlay();
      //     },
      //     (err: HttpErrorResponse) => {
      //       this.message.popup("Oops!", err.message, "error");
      //     }
      //   );
      // this.subscribes.push(sub);
      params.successCallback(
        this.uiState.requests,
        this.uiState.requests.length
      );
    },
  };

  onRowClicked(e: RowClickedEvent) {
    console.log(e.data);
  }

  ngOnDestroy(): void {}
}
