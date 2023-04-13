import { Component, Input, OnDestroy } from "@angular/core";
import { GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { Subscription } from "rxjs";
import { ActivePoliciesMedicalMembersCols } from "src/app/shared/app/grid/activePoliciesMedicalMembers";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IMedicalData } from "src/app/shared/app/models/Production/i-medical-active-list";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";

@Component({
	selector: "app-medical-members-list",
	template: `
		<div class="row justify-content-between align-items-center">
			<div class="col-md-4">
				<h5 class="header-item mb-0">List Of Medical Members</h5>
			</div>
			<div class="col-md-4">
				<div class="input-group input-group-sm">
					<input type="text" class="form-control form-control-sm" placeholder="Filter" (input)="searchData($event)" />
					<button class="btn btn-info btn-sm d-flex align-items-center" type="button">
						<!-- <i class="ri-user-search-fill mx-1"></i> -->
						<i class="ri-search-line"></i>
					</button>
				</div>
			</div>
		</div>
		<div class="ag-theme-alpine" appTableView>
			<ag-grid-angular class="gridScrollbar" style="width: 100%; height: 35vh" [gridOptions]="gridOpts"> </ag-grid-angular>
		</div>
	`,
	styles: [],
})
export class MedicalMembersListComponent implements OnDestroy {
	@Input() policiesSno!: any;

	medicalMembers: IMedicalData[] = [];

	gridReady: boolean = false;
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "clientSide",
		editType: "fullRow",
		columnDefs: ActivePoliciesMedicalMembersCols,
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

	onGridReady(param: GridReadyEvent) {
		this.gridApi = param.api;
		this.gridApi.showNoRowsOverlay();
	}

	searchData(e: any) {
		let val = e.target.value;
		this.gridApi.setQuickFilter(val);
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

	setDataSource(policiesSno: number) {
		this.gridApi.showLoadingOverlay();
		let sub = this.productionService.getMedicalsData(String(policiesSno)).subscribe((res: IBaseResponse<IMedicalData[]>) => {
			if (res.status) {
				this.medicalMembers = res.data!;
				this.gridApi.setRowData(this.medicalMembers);
				this.gridApi.redrawRows();
				if (this.medicalMembers.length === 0) this.gridApi.showNoRowsOverlay();
				else this.gridApi.hideOverlay();
			} else {
				this.message.popup("Oops!", res.message!, "warning");
				this.gridApi.hideOverlay();
			}
			this.gridReady = true;
		});
		this.subscribes.push(sub);
	}

	// onRowClicked(e: RowClickedEvent) {
	// 	this.dataEvent.emit(e.data);
	// }

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
