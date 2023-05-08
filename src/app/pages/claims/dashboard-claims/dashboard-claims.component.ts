import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { AgChartOptions } from "ag-charts-community";
import {
  CellEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { Subscription } from "rxjs";
import { localStorageKeys } from "src/app/core/models/localStorageKeys";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import {
  ActiveRequestsByClientsCols,
  ActiveRequestsGropedByIcsCols,
} from "src/app/shared/app/grid/summaryClaimsCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ClaimsType } from "src/app/shared/app/models/Claims/claims-util";
import {
  IActiveClientWithInsuranceClaim,
  IActiveRequestsByClient,
  IActiveRequestsGropedByIcs,
  IClaimSummary,
} from "src/app/shared/app/models/Claims/iclaim-summary";
import { ClaimsService } from "src/app/shared/services/claims/claims.service";

@Component({
  selector: "app-dashboard-claims",
  templateUrl: "./dashboard-claims.component.html",
  styleUrls: ["./dashboard-claims.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardClaimsComponent implements OnInit, OnDestroy {
  uiState = {
    clientsList: [] as IActiveRequestsByClient[],
    insurCompList: [] as IActiveRequestsGropedByIcs[],
    claimTypes: [
      ClaimsType.Medical,
      ClaimsType.Motor,
      ClaimsType.General,
    ] as string[],
    claimTypeList: [ClaimsType.Medical, ClaimsType.Motor, ClaimsType.General],
  };

  @Output() summaryData: EventEmitter<IActiveClientWithInsuranceClaim> =
    new EventEmitter<IActiveClientWithInsuranceClaim>();

  selectedClient!: IActiveClientWithInsuranceClaim;

  // Charts Definitions
  chartOptions!: AgChartOptions;

  // Grid Definitions
  globalGridOpts: GridOptions = {
    pagination: false,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    suppressCsvExport: true,
    rowSelection: "single",
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: false,
      resizable: true,
    },
  };

  clientGridApi: GridApi = <GridApi>{};
  clientGridOpts: GridOptions = {
    ...this.globalGridOpts,
    columnDefs: ActiveRequestsByClientsCols,
    onGridReady: (e) => this.onClientGridReady(e),
    onCellClicked: (e) => this.onClientCellClicked(e),
  };

  ICGridApi: GridApi = <GridApi>{};
  ICGridOpts: GridOptions = {
    ...this.globalGridOpts,
    columnDefs: ActiveRequestsGropedByIcsCols,
    onGridReady: (e) => this.onICGridReady(e),
    onCellClicked: (e) => this.onICCellClicked(e),
  };

  subscribes: Subscription[] = [];
  constructor(
    private claimsService: ClaimsService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getSummaryData([
      ClaimsType.General,
      ClaimsType.Medical,
      ClaimsType.Motor,
    ]);

    this.drawChartData(this.uiState.insurCompList);

    const sub = this.eventService.subscribe(reserved.changeMode, (mode) =>
      this.applyChartTheme(mode)
    );
    this.subscribes.push(sub);
  }

  getSummaryData(claimTypes: string[]): void {
    const sub = this.claimsService
      .getClaimSummary(claimTypes)
      .subscribe((res: IBaseResponse<IClaimSummary>) => {
        if (res.status) {
          this.uiState.insurCompList = res.data?.activeRequestsGropedByIcs!;
          this.uiState.clientsList = res.data?.activeRequestsByClients!;
          this.clientGridApi.setDatasource(this.clientDataSource);
          this.ICGridApi.setDatasource(this.ICDataSource);
          this.drawChartData(this.uiState.insurCompList);
        }
      });
    this.subscribes.push(sub);
  }

  clientDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      if (this.uiState.clientsList.length) {
        params.successCallback(
          this.uiState.clientsList,
          this.uiState.clientsList.length
        );
        this.clientGridApi.hideOverlay();
      }
    },
  };
  ICDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      if (this.uiState.insurCompList.length) {
        params.successCallback(
          this.uiState.insurCompList,
          this.uiState.insurCompList.length
        );
        this.ICGridApi.hideOverlay();
      }
    },
  };

  onClientGridReady(param: GridReadyEvent) {
    this.clientGridApi = param.api;
    this.clientGridApi.sizeColumnsToFit();
    this.clientGridApi.showLoadingOverlay();
  }

  onClientCellClicked(e: CellEvent) {
    this.selectedClient = {
      ...this.selectedClient,
      ...e.data,
      claimType: this.uiState.claimTypes,
    };
    this.summaryData.emit(this.selectedClient);
  }

  onICGridReady(param: GridReadyEvent) {
    this.ICGridApi = param.api;
    this.ICGridApi.sizeColumnsToFit();
    this.ICGridApi.showLoadingOverlay();
  }

  onICCellClicked(e: CellEvent) {
    this.selectedClient = {
      ...this.selectedClient,
      ...e.data,
      claimType: this.uiState.claimTypes,
    };
    this.summaryData.emit(this.selectedClient);
  }

  drawChartData(data: IActiveRequestsGropedByIcs[]) {
    this.chartOptions = {
      autoSize: true,
      data: data,
      legend: {
        position: "top",
      },
      series: [
        {
          type: "pie",
          calloutLabelKey: "insuranceCompany",
          fillOpacity: 0.9,
          strokeWidth: 0,
          angleKey: "noOfRequests",
          sectorLabelKey: "noOfRequests",
          calloutLabel: {
            enabled: false,
          },
          sectorLabel: {
            color: "white",
            fontWeight: "bold",
          },
          innerLabels: [
            {
              text: "Total",
              fontSize: 16,
            },
          ],
          fills: [
            "#fb7451",
            "#f4b944",
            "#57cc8b",
            "#49afda",
            "#3988dc",
            "#72508c",
            "#b499b5",
            "#b7b5ba",
          ],
          innerRadiusRatio: 0.5,
          highlightStyle: {
            item: {
              fillOpacity: 0,
              stroke: "#535455",
              strokeWidth: 1,
            },
          },

          tooltip: {
            renderer: ({ datum, calloutLabelKey, title, sectorLabelKey }) => {
              return {
                title: datum.insuranceCompany,
                content: `${datum[calloutLabelKey!]}: ${
                  datum[sectorLabelKey!]
                }`,
              };
            },
          },
        },
      ],
    };
    this.applyChartTheme(localStorage.getItem(localStorageKeys.themeMode)!);
  }

  applyChartTheme(mode: string): void {
    const options = { ...this.chartOptions };
    options.theme =
      mode === reserved.darkMode ? "ag-default-dark" : "ag-default";
    this.chartOptions = options;
  }

  ngOnDestroy(): void {
    if (this.subscribes) this.subscribes.forEach((s) => s.unsubscribe());
  }
}
