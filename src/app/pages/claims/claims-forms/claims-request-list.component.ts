import { HttpResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";
import { GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, RowClickedEvent } from "ag-grid-community";
import { Subscription } from "rxjs";
import { claimsPoliciesRequestCols } from "src/app/shared/app/grid/claimsFormCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IClaimPolicies, IClaimPoliciesSearch } from "src/app/shared/app/models/Claims/claims-util";
import { ClaimsService } from "src/app/shared/services/claims/claims.service";
import { MessagesService } from "src/app/shared/services/messages.service";

@Component({
	selector: "app-claims-request-list",
	template: `
		<div class="ag-theme-alpine" appTableView>
			<ag-grid-angular
				class="gridScrollbar"
				style="width: 100%;"
				[ngStyle]="{ height: selectedPolicy.className === 'Motor' || selectedPolicy.className === 'Medical' ? '35vh' : '70vh' }"
				[gridOptions]="gridOpts"
				(rowClicked)="filter.classOfInsurance === 'Motor' ? vehiclesList.setDataSource() : MedicalMembersList.setDataSource()">
			</ag-grid-angular>
		</div>

		<app-vehicles-list
			[policiesSno]="selectedPolicy.policiesSno"
			[ngClass]="{ 'd-none': filter.classOfInsurance !== 'Motor' || showPolicyVehicles }"
			#vehiclesList
			(dataLength)="setShowPolicyVehicle($event)"></app-vehicles-list>

		<app-medical-members-list
			[policiesSno]="selectedPolicy.policiesSno"
			[ngClass]="{ 'd-none': filter.classOfInsurance !== 'Medical' || showPolicyMedicalMembers }"
			#MedicalMembersList
			(dataLength)="setShowPolicyMedicalMembers($event)"></app-medical-members-list>
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

	@Output()
	dataEvent: EventEmitter<any> = new EventEmitter();

	selectedPolicy = {
		className: "" as String,
		policiesSno: 0 as Number,
	};

	showPolicyVehicles: boolean = true;
	showPolicyMedicalMembers: boolean = true;

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
		overlayNoRowsTemplate: "<alert class='alert alert-secondary'>No Data To Show</alert>",
		onGridReady: (e) => this.onGridReady(e),
		onPaginationChanged: (e) => this.onPageChange(e),
		onSortChanged: (e) => this.onSort(e),
		onRowClicked: (e) => this.onRowClicked(e),
		onRowDoubleClicked: (e) => this.onRowDoubleClicked(e),
	};

	subscribes: Subscription[] = [];
	constructor(private message: MessagesService, private claimService: ClaimsService) {}

	// Request Section
	requestDataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();
			let sub = this.claimService.searchPolicy(this.filter).subscribe((res: HttpResponse<IBaseResponse<IClaimPolicies[]>>) => {
				if (res.body?.status) {
					this.policies = res.body?.data!;
					this.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;

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
		if (this.gridReady) this.filter.pageNumber = this.gridApi.paginationGetCurrentPage() + 1;
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
		this.selectedPolicy.policiesSno = e.data.sNo;
		this.selectedPolicy.className = e.data.className;
	}

	onRowDoubleClicked(e: RowClickedEvent) {
		this.dataEvent.emit(e.data);
	}

	setShowPolicyVehicle(e: number) {
		console.log(e);
		if (e > 0) this.showPolicyVehicles = false;
	}

	setShowPolicyMedicalMembers(e: number) {
		if (e > 0) this.showPolicyMedicalMembers = false;
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
