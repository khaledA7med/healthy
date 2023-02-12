import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import PerfectScrollbar from "perfect-scrollbar";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { productionCols } from "src/app/shared/app/grid/productionCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IPolicy } from "src/app/shared/app/models/Production/i-policy";
import { IProductionFilters } from "src/app/shared/app/models/Production/iproduction-filters";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import AppUtils from "src/app/shared/app/util";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";

@Component({
	selector: "app-policies-management",
	templateUrl: "./policies-management.component.html",
	styleUrls: ["./policies-management.component.scss"],
	encapsulation: ViewEncapsulation.None,
	providers: [AppUtils],
})
export class PoliciesManagementComponent implements OnInit, OnDestroy {
	uiState = {
		routerLink: {
			forms: AppRoutes.Production.create,
		},
		filters: {
			pageNumber: 1,
			pageSize: 50,
			orderBy: "sNo",
			orderDir: "asc",
			status: ["Active"],
		} as IProductionFilters,
		gridReady: false,
		submitted: false,
		policies: {
			list: [] as IPolicy[],
			totalPages: 0,
		},
	};

	filterForm!: FormGroup;
	lookupData!: Observable<IBaseMasterTable>;
	@ViewChild("filter") policiesFilter!: ElementRef;

	subscribes: Subscription[] = [];
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: productionCols,
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
		onGridReady: (e) => this.onGridReady(e),
		onCellClicked: (e) => this.onCellClicked(e),
		onSortChanged: (e) => this.onSort(e),
		onPaginationChanged: (e) => this.onPageChange(e),
	};

	constructor(
		private _Router: Router,
		private productionService: ProductionService,
		private tableRef: ElementRef,
		private message: MessagesService,
		private offcanvasService: NgbOffcanvas,
		private table: MasterTableService,
		private appUtils: AppUtils,
		private router: Router,
		private eventService: EventService
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.getLookupData();
	}

	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();
			let sub = this.productionService.getAllPolicies(this.uiState.filters).subscribe(
				(res: HttpResponse<IBaseResponse<IPolicy[]>>) => {
					this.uiState.policies.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;

					this.uiState.policies.list = res.body?.data!;
					params.successCallback(this.uiState.policies.list, this.uiState.policies.totalPages);
					this.gridApi.hideOverlay();
					this.uiState.gridReady = true;
				},
				(err: HttpErrorResponse) => {}
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
		if ((this, this.uiState.policies.list.length > 0)) this.gridApi.sizeColumnsToFit();
	}
	//#region Filter INIT and Functions
	openPoliciesFilter() {
		this.offcanvasService.open(this.policiesFilter, { position: "end" });
	}

	private initFilterForm(): void {
		this.filterForm = new FormGroup({
			clientName: new FormControl(null),
			groupName: new FormControl(null),
			status: new FormControl([]),
			leadType: new FormControl(null),
			branch: new FormControl(null),
			classOfBusiness: new FormControl(null),
			producer: new FormControl(null),
			user: new FormControl(null),
			deadlineFrom: new FormControl(null),
			deadlineTo: new FormControl(null),
			savedOnFrom: new FormControl(null),
			savedOnTo: new FormControl(null),
			expireIn: new FormControl(null),
		});
	}

	get f() {
		return this.filterForm.controls;
	}

	getLookupData() {
		this.lookupData = this.table.getBaseData(MODULES.Production);
	}

	modifyFilterReq() {
		this.uiState.filters = {
			...this.uiState.filters,
			...this.filterForm.value,
		};
	}

	setDeadLineFilter(e: any) {
		this.f["deadlineFrom"].setValue(this.appUtils.dateFormater(e.from));
		this.f["deadlineTo"].setValue(this.appUtils.dateFormater(e.to));
	}

	setSavedOnFilter(e: any) {
		this.f["savedOnFrom"].setValue(this.appUtils.dateFormater(e.from));
		this.f["savedOnTo"].setValue(this.appUtils.dateFormater(e.to));
	}

	onPolicyFilters(): void {
		this.modifyFilterReq();
		this.gridApi.setDatasource(this.dataSource);
	}

	clearFilter() {
		this.filterForm.reset();
	}
	//#endregion

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}

	// Don't Forget to Delete The following lines and the HTML BUtton
	route: string = AppRoutes.Production.base;
	openPolicyDetailsTest(sno: number) {
		this._Router.navigate([{ outlets: { details: [this.route, sno] } }]);
	}
}
