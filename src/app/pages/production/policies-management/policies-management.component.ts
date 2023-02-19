import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import PerfectScrollbar from "perfect-scrollbar";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { productionCols } from "src/app/shared/app/grid/productionCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IPolicy } from "src/app/shared/app/models/Production/i-policy";
import { IProductionFilters } from "src/app/shared/app/models/Production/iproduction-filters";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import AppUtils from "src/app/shared/app/util";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
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
		lineOfBusinessList: [] as IGenericResponseType[],
		filterByAmount: false,
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
		overlayNoRowsTemplate: "<alert class='alert alert-secondary'>No Data To Show</alert>",
		onGridReady: (e) => this.onGridReady(e),
		onCellClicked: (e) => this.onCellClicked(e),
		onSortChanged: (e) => this.onSort(e),
		onPaginationChanged: (e) => this.onPageChange(e),
	};

	constructor(
		private productionService: ProductionService,
		private masterService: MasterMethodsService,
		private tableRef: ElementRef,
		private message: MessagesService,
		private offcanvasService: NgbOffcanvas,
		private table: MasterTableService,
		private appUtils: AppUtils,
		private eventService: EventService
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.getLookupData();
		this.disableAmountFilter();
	}

	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();
			let sub = this.productionService.getAllPolicies(this.uiState.filters).subscribe(
				(res: HttpResponse<IBaseResponse<IPolicy[]>>) => {
					if (res.status) {
						this.uiState.policies.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;
						this.uiState.policies.list = res.body?.data!;
						params.successCallback(this.uiState.policies.list, this.uiState.policies.totalPages);
						if (this.uiState.policies.list.length === 0) this.gridApi.showNoRowsOverlay();
						this.uiState.gridReady = true;
						this.gridApi.hideOverlay();
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
		// this.gridApi.sizeColumnsToFit();

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
			status: new FormControl(["Active"]),
			branch: new FormControl(""),
			ourRef: new FormControl(""),
			clientName: new FormControl(""),
			producer: new FormControl(""),
			insurCompany: new FormControl(""),
			classOfInsurance: new FormControl(""),
			lineOfBusiness: new FormControl(""),
			policyNo: new FormControl(""),
			endorsNo: new FormControl(""),
			policyEndorsType: new FormControl(""),
			clientDNCNNo: new FormControl(""),
			companyCommisionDNCNNo: new FormControl(""),
			ourDNCNNo: new FormControl(""),
			createdBy: new FormControl(""),
			issueFrom: new FormControl(null),
			issueTo: new FormControl(null),
			financeApproveFrom: new FormControl(null),
			financeApproveTo: new FormControl(null),
			inceptionFrom: new FormControl(null),
			inceptionTo: new FormControl(null),
			financeEntryFrom: new FormControl(null),
			financeEntryTo: new FormControl(null),
			amount: new FormControl(this.uiState.filterByAmount),
			field: new FormControl(""),
			operatordList: new FormControl(""),
			amountNo: new FormControl(""),
			amountNo2: new FormControl(""),
		});
	}

	get f() {
		return this.filterForm.controls;
	}

	getLookupData() {
		this.lookupData = this.table.getBaseData(MODULES.Production);
	}

	getLineOfBusiness(e: IGenericResponseType) {
		let sub = this.masterService.getLineOfBusiness(e.name).subscribe(
			(res: HttpResponse<IBaseResponse<any>>) => {
				this.uiState.lineOfBusinessList = res.body?.data!.content;
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
			}
		);
		this.subscribes.push(sub);
	}

	modifyFilterReq() {
		this.uiState.filters = {
			...this.uiState.filters,
			...this.filterForm.value,
			amount: JSON.stringify(this.f["amount"].value),
			amountNo: this.f["amountNo2"].value ? JSON.stringify(this.f["amountNo"].value) : "",
			amountNo2: this.f["amountNo2"].value ? JSON.stringify(this.f["amountNo2"].value) : "",
		};
	}

	setIssueRangeFilter(e: any) {
		this.f["issueFrom"].patchValue(this.appUtils.dateFormater(e.from));
		this.f["issueTo"].patchValue(this.appUtils.dateFormater(e.to));
	}

	setFinApprovedRangeFilter(e: any) {
		this.f["financeApproveFrom"].patchValue(this.appUtils.dateFormater(e.from));
		this.f["financeApproveTo"].patchValue(this.appUtils.dateFormater(e.to));
	}

	setInceptionRangeFilter(e: any) {
		this.f["inceptionFrom"].patchValue(this.appUtils.dateFormater(e.from));
		this.f["inceptionTo"].patchValue(this.appUtils.dateFormater(e.to));
	}

	setFinEntryRangeFilter(e: any) {
		this.f["financeEntryFrom"].patchValue(this.appUtils.dateFormater(e.from));
		this.f["financeEntryTo"].patchValue(this.appUtils.dateFormater(e.to));
	}

	disableAmountFilter() {
		if (this.f["amount"].value === false) {
			this.f["field"].reset();
			this.f["operatordList"].reset();
			this.f["amountNo"].reset();
			this.f["amountNo2"].reset();
			this.f["field"].disable();
			this.f["operatordList"].disable();
			this.f["amountNo"].disable();
			this.f["amountNo2"].disable();
		} else {
			this.f["field"].enable();
			this.f["operatordList"].enable();
			this.f["amountNo"].enable();
			this.f["amountNo2"].enable();
		}
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
}
