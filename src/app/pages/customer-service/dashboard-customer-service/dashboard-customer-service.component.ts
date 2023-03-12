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
  ActiveRequestsByClientCols,
  ActiveRequestsByInsuranceCompanyCols,
} from "src/app/shared/app/grid/summaryCustomerServiceCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import {
  IActiveClientWithInsurance,
  IActiveRequestsByClassOfBusiness,
  IActiveRequestsByClient,
  IActiveRequestsByInsuranceCompany,
  ICustomerServiceSummary,
} from "src/app/shared/app/models/CustomerService/icustomer-service-summary";
import { CustomerServiceService } from "src/app/shared/services/customer-service/customer-service.service";

@Component({
  selector: "app-dashboard-customer-service",
  templateUrl: "./dashboard-customer-service.component.html",
  styleUrls: ["./dashboard-customer-service.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardCustomerServiceComponent implements OnInit, OnDestroy {
  uiState = {
    clientsList: [] as IActiveRequestsByClient[],
    insurCompList: [] as IActiveRequestsByInsuranceCompany[],
    classOfBusiness: [] as IActiveRequestsByClassOfBusiness[],
  };

  @Output() summaryData: EventEmitter<IActiveClientWithInsurance> =
    new EventEmitter<IActiveClientWithInsurance>();

  selectedClient!: IActiveClientWithInsurance;

  // Charts Definitions
  chartOptions!: AgChartOptions;

  // Grid Definitions
  clientGridApi: GridApi = <GridApi>{};
  clientGridOpts: GridOptions = {
    pagination: false,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: ActiveRequestsByClientCols,
    suppressCsvExport: true,
    rowSelection: "single",
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: false,
      resizable: true,
    },
    onGridReady: (e) => this.onClientGridReady(e),
    onCellClicked: (e) => this.onClientCellClicked(e),
  };

  insuranceGridApi: GridApi = <GridApi>{};
  insuranceGridOpts: GridOptions = {
    pagination: false,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: ActiveRequestsByInsuranceCompanyCols,
    suppressCsvExport: true,
    rowSelection: "single",
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: false,
      resizable: true,
    },
    onGridReady: (e) => this.onInsuranceGridReady(e),
    onCellClicked: (e) => this.onInsuranceCellClicked(e),
  };

  subscribes: Subscription[] = [];
  constructor(
    private tableRef: ElementRef,
    private customerService: CustomerServiceService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getSummaryData();
    this.drawChartData(this.uiState.classOfBusiness);

    const sub = this.eventService.subscribe(reserved.changeMode, (mode) =>
      this.applyChartTheme(mode)
    );
    this.subscribes.push(sub);
  }

  getSummaryData(): void {
    const sub = this.customerService
      .getRequestsSummary()
      .subscribe((res: IBaseResponse<ICustomerServiceSummary>) => {
        if (res.status) {
          this.uiState.classOfBusiness =
            res.data?.activeRequestsByClassOfBusiness!;
          this.uiState.insurCompList =
            res.data?.activeRequestsByInsuranceCompany!;
          this.uiState.clientsList = res.data?.activeRequestsByClient!;
          this.clientGridApi.setDatasource(this.clientDataSource);
          this.insuranceGridApi.setDatasource(this.insuranceDataSource);
          this.drawChartData(this.uiState.classOfBusiness);
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
  insuranceDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      if (this.uiState.insurCompList.length) {
        params.successCallback(
          this.uiState.insurCompList,
          this.uiState.insurCompList.length
        );
        this.insuranceGridApi.hideOverlay();
      }
    },
  };

  onClientGridReady(param: GridReadyEvent) {
    this.clientGridApi = param.api;
    this.clientGridApi.sizeColumnsToFit();
    this.clientGridApi.showLoadingOverlay();
  }
  onClientCellClicked(e: CellEvent) {
    this.selectedClient = { ...this.selectedClient, ...e.data };
    this.summaryData.emit(this.selectedClient);
  }

  onInsuranceGridReady(param: GridReadyEvent) {
    this.insuranceGridApi = param.api;
    this.insuranceGridApi.sizeColumnsToFit();
    this.insuranceGridApi.showLoadingOverlay();
  }
  onInsuranceCellClicked(e: CellEvent) {
    this.selectedClient = { ...this.selectedClient, ...e.data };
    this.summaryData.emit(this.selectedClient);
  }

  drawChartData(data: IActiveRequestsByClassOfBusiness[]) {
    this.chartOptions = {
      autoSize: true,
      data: data,
      legend: {
        position: "top",
      },
      series: [
        {
          type: "pie",
          calloutLabelKey: "classOfBusiness",
          fillOpacity: 0.9,
          strokeWidth: 0,
          angleKey: "count",
          sectorLabelKey: "count",
          calloutLabel: {
            enabled: false,
          },
          sectorLabel: {
            color: "white",
            fontWeight: "bold",
          },
          title: {
            // text: "2018/19",
          },
          innerLabels: [
            {
              text: "numFormatter.format(total)",
              fontSize: 24,
              fontWeight: "bold",
            },
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
                title: datum.classOfBusiness,
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
