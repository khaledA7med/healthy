import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, RowClickedEvent } from "ag-grid-community";
import { Subscription } from "rxjs";
import { CSPoicySearchCols } from "src/app/shared/app/grid/csPolicySearchCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { CSPolicyData } from "src/app/shared/app/models/CustomerService/icustomer-service-policy";
import { CSPolicySearchRequest } from "src/app/shared/app/models/CustomerService/icustomer-service-policy-search-req";
import { CustomerServiceService } from "src/app/shared/services/customer-service/customer-service.service";
import { MessagesService } from "src/app/shared/services/messages.service";

@Component({
	selector: "app-CS-Policy-list",
	template: `
		<div class="ag-theme-alpine" appTableView>
			<ag-grid-angular class="gridScrollbar" style="width: 100%; height: 75vh" [gridOptions]="gridOpts"> </ag-grid-angular>
		</div>
	`,
	styles: [],
})
export class CustomerServiceListComponent implements OnDestroy, OnInit {
	@Input() filter!: any;
	@Input() type!: string;
	@Output() dataEvent: EventEmitter<any> = new EventEmitter();
	uiState = {
		policies: [] as CSPolicyData[],
	};

	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		paginationAutoPageSize: true,
		cacheBlockSize: 500,
		animateRows: true,
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			resizable: true,
		},
		overlayNoRowsTemplate: "<alert class='alert alert-secondary'>No Data To Show</alert>",
		onGridReady: (e) => this.onGridReady(e),
		onRowClicked: (e) => this.onRowClicked(e),
	};

	subscribes: Subscription[] = [];

	constructor(private tableRef: ElementRef, private message: MessagesService, private customerService: CustomerServiceService) {}
	ngOnInit(): void {}

	onGridReady(param: GridReadyEvent) {
		this.gridApi = param.api;
		this.gridApi.sizeColumnsToFit();
		this.gridApi.showNoRowsOverlay();
		this.gridOpts.api!.setColumnDefs(CSPoicySearchCols);
	}

	// Policies Section
	policyDataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();
			let dataTOSubmit: CSPolicySearchRequest = {
				clientNo: this.filter.clientNo !== null ? this.filter.clientNo : 0,
				policyNo: this.filter.policyNo !== null ? this.filter.policyNo : "",
				insuranceCompName: this.filter.insuranceCompName !== null ? this.filter.insuranceCompName : "",
			};
			let sub = this.customerService.searchPolicy(dataTOSubmit).subscribe(
				(res: HttpResponse<IBaseResponse<CSPolicyData[]>>) => {
					if (res.status) {
						this.uiState.policies = res.body?.data!;
						params.successCallback(this.uiState.policies, this.uiState.policies.length);
						if (this.uiState.policies.length === 0) this.gridApi.showNoRowsOverlay();
						else this.gridApi.hideOverlay();
					} else {
						this.message.popup("Oops!", res.body?.message!, "warning");
						this.gridApi.hideOverlay();
					}
				},
				(err: HttpErrorResponse) => {
					this.gridApi.hideOverlay();
					this.message.popup("Oops!", err.message, "error");
				}
			);
			this.subscribes.push(sub);
		},
	};

	setDataSource() {
		this.gridApi.setDatasource(this.policyDataSource);
	}

	onRowClicked(e: RowClickedEvent) {
		this.dataEvent.emit(e.data);
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
