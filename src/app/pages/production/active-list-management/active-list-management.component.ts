import { HttpResponse } from "@angular/common/http";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NavigationStart, Router } from "@angular/router";
import { NgbModal, NgbModalRef, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { Observable, Subscription } from "rxjs";
import { MODULES } from "src/app/core/models/MODULES";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { Roles } from "src/app/core/roles/Roles";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { ActiveListCols } from "src/app/shared/app/grid/ActiveListCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IPolicy } from "src/app/shared/app/models/Production/i-policy";
import { IProductionFilters, IProductionFiltersForm } from "src/app/shared/app/models/Production/iproduction-filters";
import AppUtils from "src/app/shared/app/util";
import { PoilcyPreviewComponent } from "src/app/shared/components/poilcy-preview/poilcy-preview.component";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";

@Component({
	selector: "app-active-list-management",
	templateUrl: "./active-list-management.component.html",
	styleUrls: ["./active-list-management.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class ActiveListManagementComponent implements OnInit, OnDestroy {
	uiState = {
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
		privileges: ProductionPermissions,
	};

	permissions$!: Observable<string[]>;

	filterForm!: FormGroup<IProductionFiltersForm>;
	lookupData!: Observable<IBaseMasterTable>;
	@ViewChild("filter") policiesFilter!: ElementRef;
	modalRef!: NgbModalRef;

	subscribes: Subscription[] = [];
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: ActiveListCols,
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
		private message: MessagesService,
		private offcanvasService: NgbOffcanvas,
		private table: MasterTableService,
		private appUtils: AppUtils,
		private router: Router,
		private modalService: NgbModal,
		private permission: PermissionsService,
		private auth: AuthenticationService
	) {}

	ngOnInit(): void {
		this.permissions$ = this.permission.getPrivileges(Roles.Production);

		this.initFilterForm();
		this.getLookupData();
		// this.disableAmountFilter();

		let sub = this.permissions$.subscribe((res: string[]) => {
			if (!res.includes(this.uiState.privileges.ViewAllBranchs)) this.f.branch?.patchValue(this.auth.getUser().Branch!);
			if (!res.includes(this.uiState.privileges.ChAccessAllProducersProduction)) this.f.producer?.patchValue(this.auth.getUser().name!);
			if (!res.includes(this.uiState.privileges.ChProductionAccessAllUsers)) this.f.producer?.patchValue(this.auth.getUser().name!);
		});
		let sub2 = this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				this.modalService.hasOpenModals() ? this.modalRef.close() : "";
			}
		});
		this.subscribes.push(sub, sub2);
	}
	//#region Grid Functions
	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();
			let sub = this.productionService.getAllPolicies(this.uiState.filters).subscribe((res: HttpResponse<IBaseResponse<any[]>>) => {
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
			});
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
		if ((this, this.uiState.policies.list.length > 0)) this.gridApi.sizeColumnsToFit();
	}
	//#endregion

	//#region Filter INIT and Functions
	openPoliciesFilter() {
		this.offcanvasService.open(this.policiesFilter, { position: "end" });
	}

	private initFilterForm(): void {
		this.filterForm = new FormGroup<any>({
			status: new FormControl(["Active"], Validators.required),
			branch: new FormControl(""),
			ourRef: new FormControl(""),
			clientName: new FormControl(""),
			producer: new FormControl([]),
			insurCompany: new FormControl(""),
			classOfInsurance: new FormControl(""),
			policyNo: new FormControl(""),
			endorsNo: new FormControl(""),
			policyEndorsType: new FormControl(""),
			clientDNCNNo: new FormControl(""),
			companyCommisionDNCNNo: new FormControl(""),
			ourDNCNNo: new FormControl(""),
			createdBy: new FormControl(""),
			issueFrom: new FormControl(""),
			issueTo: new FormControl(""),
			financeApproveFrom: new FormControl(""),
			financeApproveTo: new FormControl(""),
			inceptionFrom: new FormControl(""),
			inceptionTo: new FormControl(""),
			financeEntryFrom: new FormControl(""),
			financeEntryTo: new FormControl(""),
			amount: new FormControl(""),
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

	modifyFilterReq() {
		this.uiState.filters = {
			...this.uiState.filters,
			...this.filterForm.value,
			issueFrom: this.appUtils.dateFormater(this.f.issueFrom?.value) as any,
			issueTo: this.appUtils.dateFormater(this.f.issueTo?.value) as any,
			financeApproveFrom: this.appUtils.dateFormater(this.f.financeApproveFrom?.value) as any,
			financeApproveTo: this.appUtils.dateFormater(this.f.financeApproveTo?.value) as any,
			inceptionFrom: this.appUtils.dateFormater(this.f.inceptionFrom?.value) as any,
			inceptionTo: this.appUtils.dateFormater(this.f.inceptionTo?.value) as any,
			financeEntryFrom: this.appUtils.dateFormater(this.f.financeEntryFrom?.value) as any,
			financeEntryTo: this.appUtils.dateFormater(this.f.financeEntryTo?.value) as any,
			amount: JSON.stringify(this.f.amount?.value) as any,
			amountNo: this.f.amountNo2?.value ? JSON.stringify(this.f.amountNo?.value) : "",
			amountNo2: this.f.amountNo2?.value ? JSON.stringify(this.f.amountNo2?.value) : "",
		};
	}

	setIssueRangeFilter(e: any) {
		this.f.issueFrom?.patchValue(e.from);
		this.f.issueTo?.patchValue(e.to);
	}

	setFinApprovedRangeFilter(e: any) {
		this.f.financeApproveFrom?.patchValue(e.from);
		this.f.financeApproveTo?.patchValue(e.to);
	}

	setInceptionRangeFilter(e: any) {
		this.f.inceptionFrom?.patchValue(e.from);
		this.f.inceptionTo?.patchValue(e.to);
	}

	setFinEntryRangeFilter(e: any) {
		this.f.financeEntryFrom?.patchValue(e.from);
		this.f.financeEntryTo?.patchValue(e.to);
	}

	disableAmountFilter() {
		if (this.f.amount?.value === false) {
			this.f.field?.reset();
			this.f.operatordList?.reset();
			this.f.amountNo?.reset();
			this.f.amountNo2?.reset();
			this.f.field?.disable();
			this.f.operatordList?.disable();
			this.f.amountNo?.disable();
			this.f.amountNo2?.disable();
		} else {
			this.f.field?.enable();
			this.f.operatordList?.enable();
			this.f.amountNo?.enable();
			this.f.amountNo2?.enable();
		}
	}

	openPolicyPreview(id: string) {
		this.modalRef = this.modalService.open(PoilcyPreviewComponent, {
			fullscreen: true,
			scrollable: true,
		});
		this.modalRef.componentInstance.data = {
			id,
			activateUploadBtns: true,
		};
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