import { Component, ElementRef, OnInit } from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { CellEvent, EventService, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { Observable, Subscription } from "rxjs";
import { NgbModal, NgbModalRef, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import PerfectScrollbar from "perfect-scrollbar";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { SystemAdminService } from "src/app/shared/services/system-admin/system-admin.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import AppUtils from "src/app/shared/app/util";

@Component({
	selector: "app-user-privileges",
	templateUrl: "./user-privileges.component.html",
	styleUrls: ["./user-privileges.component.scss"],
})
export class UserPrivilegesComponent implements OnInit {
	uiState = {
		filters: {
			pageNumber: 1,
			pageSize: 50,
			orderBy: "sno",
			orderDir: "asc",
		},
		gridReady: false,
		submitted: false,
		privileges: {
			list: [],
			totalPages: 0,
		},
	};
	subscribes: Subscription[] = [];
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: [],
		suppressCsvExport: true,
		paginationPageSize: this.uiState.filters.pageSize,
		cacheBlockSize: this.uiState.filters.pageSize,
		context: { comp: this },
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			sortable: true,
			resizable: true,
		},
		// onGridReady: (e) => this.onGridReady(e),
		onCellClicked: (e) => this.onCellClicked(e),
		onSortChanged: (e) => this.onSort(e),
		onPaginationChanged: (e) => this.onPageChange(e),
	};

	constructor(
		private systemAdminService: SystemAdminService,
		private tableRef: ElementRef,
		private message: MessagesService,
		private offcanvasService: NgbOffcanvas,
		private appUtils: AppUtils,
		private eventService: EventService,
		private modalService: NgbModal
	) {}

	//#region AG Grid

	// dataSource: IDatasource = {
	// 	getRows: (params: IGetRowsParams) => {
	// 		this.gridApi.showLoadingOverlay();
	// 		let sub = this.systemAdminService.getAllAdmins(this.uiState.filters).subscribe(
	// 			(res: HttpResponse<IBaseResponse<ISystemAdmin[]>>) => {
	// 				this.uiState.admins.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;

	// 				this.uiState.admins.list = res.body?.data!;
	// 				params.successCallback(this.uiState.admins.list, this.uiState.admins.totalPages);
	// 				this.uiState.gridReady = true;
	// 				this.gridApi.hideOverlay();
	// 			},
	// 			(err: HttpErrorResponse) => {
	// 				this.message.popup("Oops!", err.message, "error");
	// 			}
	// 		);
	// 		this.subscribes.push(sub);
	// 	},
	// };

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

	// onPageSizeChange() {
	// 	this.gridApi.paginationSetPageSize(+this.uiState.filters.pageSize);
	// 	this.gridOpts.cacheBlockSize = +this.uiState.filters.pageSize;
	// 	this.gridApi.showLoadingOverlay();
	// 	this.gridApi.setDatasource(this.dataSource);
	// }

	onPageChange(params: GridReadyEvent) {
		if (this.uiState.gridReady) {
			this.uiState.filters.pageNumber = this.gridApi.paginationGetCurrentPage() + 1;
		}
	}

	// onGridReady(param: GridReadyEvent) {
	// 	this.gridApi = param.api;
	// 	this.gridApi.setDatasource(this.dataSource);
	// 	// this.gridApi.sizeColumnsToFit();

	// 	const agBodyHorizontalViewport: HTMLElement = this.tableRef.nativeElement.querySelector("#gridScrollbar .ag-body-horizontal-scroll-viewport");
	// 	const agBodyViewport: HTMLElement = this.tableRef.nativeElement.querySelector("#gridScrollbar .ag-body-viewport");

	// 	if (agBodyViewport) {
	// 		const vertical = new PerfectScrollbar(agBodyViewport);
	// 		vertical.update();
	// 	}
	// 	if (agBodyHorizontalViewport) {
	// 		const horizontal = new PerfectScrollbar(agBodyHorizontalViewport);
	// 		horizontal.update();
	// 	}
	// 	if ((this, this.uiState.admins.list.length > 0)) this.gridApi.sizeColumnsToFit();
	// }
	//#region

	ngOnInit(): void {}
}
