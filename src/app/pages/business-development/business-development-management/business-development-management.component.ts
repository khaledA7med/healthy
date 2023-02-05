import { Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Subscription } from "rxjs";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import PerfectScrollbar from "perfect-scrollbar";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IBusineeDevelopment } from "src/app/shared/app/models/BusinessDevelopment/ibusineeDevelopment";
import { IBusinessDevelopmentFilters } from "src/app/shared/app/models/BusinessDevelopment/ibusinessDevelopmentFilters";
import { businessDevelopmentCols } from "src/app/shared/app/grid/businessDevelopmentCols";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { BusinessDevelopmentService } from "src/app/shared/services/business-development/business-development.service";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";

@Component({
	selector: "app-business-development-management",
	templateUrl: "./business-development-management.component.html",
	styleUrls: ["./business-development-management.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class BusinessDevelopmentManagementComponent implements OnInit, OnDestroy {
	uiState = {
		view: "card",
		routerLink: {
			forms: AppRoutes.BusinessDevelopment.create,
		},
		gridReady: false,
		submitted: false,
		filters: {
			pageNumber: 1,
			pageSize: 50,
			orderBy: "sNo",
			orderDir: "asc",
		} as IBusinessDevelopmentFilters,
		salesLead: {
			list: [] as IBusineeDevelopment[],
			totalPages: 0,
		},
	};

	// To Unsubscription
	subscribes: Subscription[] = [];
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: businessDevelopmentCols,
		suppressCsvExport: true,
		paginationPageSize: this.uiState.filters.pageSize,
		cacheBlockSize: this.uiState.filters.pageSize,
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			sortable: true,
		},
		onGridReady: (e) => this.onGridReady(e),
		onCellClicked: (e) => this.onCellClicked(e),
		onSortChanged: (e) => this.onSort(e),
		onPaginationChanged: (e) => this.onPageChange(e),
	};
	constructor(
		private businssDevelopmenService: BusinessDevelopmentService,
		private tableRef: ElementRef,
		private message: MessagesService,
		private offcanvasService: NgbOffcanvas,
		private table: MasterTableService,
		private router: Router
	) {}

	ngOnInit(): void {}

	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();

			let sub = this.businssDevelopmenService.getAllSalesLeads(this.uiState.filters).subscribe(
				(res: HttpResponse<IBaseResponse<IBusineeDevelopment[]>>) => {
					this.uiState.salesLead.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;

					this.uiState.salesLead.list = res.body?.data!;

					params.successCallback(this.uiState.salesLead.list, this.uiState.salesLead.totalPages);
					this.uiState.gridReady = true;
					this.gridApi.hideOverlay();
				},
				(err: HttpErrorResponse) => {
					this.message.popup("Oops!", err.message, "error");
				}
			);
			this.subscribes.push(sub);
		},
	};

	onSort(e: GridReadyEvent) {
		let colState = e.columnApi.getColumnState();
		colState.forEach((el) => {
			if (el.sort) {
				this.uiState.filters.orderBy = el.colId!;
				this.uiState.filters.orderDir = el.sort!;
			}
		});
	}

	onCellClicked(params: CellEvent) {
		if (params.column.getColId() == "action") {
			params.api.getCellRendererInstances({
				rowNodes: [params.node],
				columns: [params.column],
			});
		}
	}

	onPageSizeChange() {
		this.gridApi.paginationSetPageSize(+this.uiState.filters.pageSize);
		this.gridOpts.cacheBlockSize = +this.uiState.filters.pageSize;
		this.gridApi.showLoadingOverlay();
		this.gridApi.setDatasource(this.dataSource);
	}

	onPageChange(params: GridReadyEvent) {
		if (this.uiState.gridReady) {
			this.uiState.filters.pageNumber = this.gridApi.paginationGetCurrentPage() + 1;
		}
	}

	onGridReady(param: GridReadyEvent) {
		this.gridApi = param.api;
		this.gridApi.setDatasource(this.dataSource);
		this.gridApi.sizeColumnsToFit();

		const agBodyHorizontalViewport: HTMLElement = this.tableRef.nativeElement.querySelector("#gridScrollbar .ag-body-horizontal-scroll-viewport");
		const agBodyViewport: HTMLElement = this.tableRef.nativeElement.querySelector("#gridScrollbar .ag-body-viewport");

		if (agBodyViewport) {
			const vertical = new PerfectScrollbar(agBodyViewport);
			vertical.update();
		}
		if (agBodyHorizontalViewport) {
			const horizontal = new PerfectScrollbar(agBodyHorizontalViewport);
			horizontal.update();
		}
	}

	openFilterOffcanvas() {}

	ngOnDestroy(): void {}
}
