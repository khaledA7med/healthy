import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { Subscription } from "rxjs";
import { ActivePoliciesVehiclesCols } from "src/app/shared/app/grid/activePoliciesVehicles";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IMotorData } from "src/app/shared/app/models/Production/i-motor-active-list";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";

@Component({
	selector: "app-vehicles-list",
	template: `
		<div class="ag-theme-alpine" appTableView>
			<ag-grid-angular class="gridScrollbar" style="width: 100%; height: 35vh" [gridOptions]="gridOpts"> </ag-grid-angular>
		</div>
	`,
	styles: [],
})
export class VehiclesListComponent implements OnDestroy {
	@Input() policiesSno!: any;
	@Output() dataLength: EventEmitter<any> = new EventEmitter();
	vehicles: IMotorData[] = [];

	gridReady: boolean = false;
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		columnDefs: ActivePoliciesVehiclesCols,
		animateRows: true,
		// paginationPageSize: this.filter.pageSize,
		// cacheBlockSize: this.filter.pageSize,
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			resizable: true,
			sortable: true,
		},
		overlayNoRowsTemplate: "<alert class='alert alert-secondary'>No Data To Show</alert>",
		onGridReady: (e) => this.onGridReady(e),
		// onPaginationChanged: (e) => this.onPageChange(e),
		// onSortChanged: (e) => this.onSort(e),
		// onRowClicked: (e) => this.onRowClicked(e),
	};

	subscribes: Subscription[] = [];
	constructor(private message: MessagesService, private productionService: ProductionService) {}

	// Request Section
	requestDataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();
			let sub = this.productionService.getVehiclesData(this.policiesSno).subscribe((res: IBaseResponse<IMotorData[]>) => {
				if (res.status) {
					this.vehicles = res.data!;
					params.successCallback(this.vehicles, this.vehicles.length);
					if (this.vehicles.length === 0) this.gridApi.showNoRowsOverlay();
					else this.gridApi.hideOverlay();

					this.dataLength.emit(this.vehicles.length);
				} else {
					this.message.popup("Oops!", res.message!, "warning");
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

	// onPageChange(params: GridReadyEvent) {
	// 	if (this.gridReady) this.filter.pageNumber = this.gridApi.paginationGetCurrentPage() + 1;
	// }

	// onSort(e: GridReadyEvent) {
	// 	let colState = e.columnApi.getColumnState();
	// 	colState.forEach((el) => {
	// 		if (el.sort) {
	// 			this.filter.orderBy = el.colId!;
	// 			this.filter.orderDir = el.sort!;
	// 		}
	// 	});
	// }

	setDataSource() {
		this.gridApi.setDatasource(this.requestDataSource);
	}

	// onRowClicked(e: RowClickedEvent) {
	// 	this.dataEvent.emit(e.data);
	// }

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
