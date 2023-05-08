import AppUtils from "src/app/shared/app/util";
import { IClaimsFilter } from "./../../../shared/app/models/Claims/iclaims-filter";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessagesService } from "./../../../shared/services/messages.service";
import { ClaimsService } from "./../../../shared/services/claims/claims.service";
import { claimsManageCols } from "./../../../shared/app/grid/claimsCols";
import { IBaseFilters } from "./../../../shared/app/models/App/IBaseFilters";
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { IClaims } from "src/app/shared/app/models/Claims/iclaims";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { Observable, Subscription } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { NgbDate, NgbOffcanvas, NgbOffcanvasRef } from "@ng-bootstrap/ng-bootstrap";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { IClaimsFollowUp } from "src/app/shared/app/models/Claims/iclaims-followUp";
import { EmailModalComponent } from "src/app/shared/components/email/email-modal/email-modal.component";
import { IEmailResponse } from "src/app/shared/app/models/Email/email-response";
import { DashboardClaimsComponent } from "../dashboard-claims/dashboard-claims.component";
import { IActiveClientWithInsuranceClaim } from "src/app/shared/app/models/Claims/iclaim-summary";
import { claimsStatus, ClaimsType, IClaimsFollowUpForm } from "src/app/shared/app/models/Claims/claims-util";
import { ClaimsPermissions } from "src/app/core/roles/claims-permissions";
import { Roles } from "src/app/core/roles/Roles";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { EventService } from "src/app/core/services/event.service";

@Component({
	selector: "app-claims-list",
	templateUrl: "./claims-list.component.html",
	styleUrls: ["./claims-list.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class ClaimsListComponent implements OnInit, OnDestroy {
	uiState = {
		routerLink: {
			forms: AppRoutes.Claims.create,
		},
		gridReady: false,
		filters: {
			pageNumber: 1,
			pageSize: 50,
			orderBy: "sNo",
			orderDir: "asc",
		} as IBaseFilters,
		claims: {
			list: [] as IClaims[],
			subStatus: [] as string[],
			followUpData: [] as IClaimsFollowUp[],
			totalPages: 0,
			emailData: {} as IEmailResponse,
		},
		privileges: ClaimsPermissions,
	};
	isLoading: boolean = false;

	permissions$!: Observable<string[]>;

	canvasRef!: NgbOffcanvasRef;

	filterForm!: FormGroup<IClaimsFilter>;
	followUpForm!: FormGroup<IClaimsFollowUpForm>;
	formData!: Observable<IBaseMasterTable>;
	@ViewChild("followUp") followUpCanvas!: ElementRef;
	@ViewChild(EmailModalComponent) email!: EmailModalComponent;

	// Grid Definitions
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: claimsManageCols,
		suppressCsvExport: true,
		paginationPageSize: this.uiState.filters.pageSize,
		cacheBlockSize: this.uiState.filters.pageSize,
		context: { comp: this },
		rowSelection: "single",
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
	subscribes: Subscription[] = [];
	constructor(
		private claimService: ClaimsService,
		private message: MessagesService,
		private offcanvasService: NgbOffcanvas,
		private table: MasterTableService,
		private util: AppUtils,
		private eventService: EventService,
		private permission: PermissionsService,
		private auth: AuthenticationService
	) {}

	ngOnInit(): void {
		this.permissions$ = this.permission.getPrivileges(Roles.Claims);
		this.formData = this.table.getBaseData(MODULES.Claims);
		this.initFilterForm();
		this.getSubStatus();
		let sub = this.permissions$.subscribe((res: string[]) => {
			if (!res.includes(this.uiState.privileges.ChAccessAllBrancheClaim)) this.filterF.branch?.patchValue(this.auth.getUser().Branch!);
			if (!res.includes(this.uiState.privileges.ChAccessAllUsersClaim)) this.filterF.savedUser?.patchValue(this.auth.getUser().name!);
		});
		this.subscribes.push(sub);
	}

	//#region Table
	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();

			let sub = this.claimService.getAllClaims(this.uiState.filters).subscribe((res: HttpResponse<IBaseResponse<IClaims[]>>) => {
				this.uiState.claims.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;

				this.uiState.claims.list = res.body?.data!;

				params.successCallback(this.uiState.claims.list, this.uiState.claims.totalPages);
				if (this.uiState.claims.list.length === 0) {
					this.gridApi.showNoRowsOverlay();
				} else {
					this.uiState.gridReady = true;
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
		this.gridApi.sizeColumnsToFit();
	}
	//#endregion

	//#region filter
	openFilterCanvas(name: TemplateRef<any>) {
		this.offcanvasService.open(name, { position: "end" });
	}

	private initFilterForm() {
		this.filterForm = new FormGroup<IClaimsFilter>({
			branch: new FormControl(null),
			clientId: new FormControl(null),
			clientName: new FormControl(null),
			claimType: new FormControl([ClaimsType.Medical, ClaimsType.Motor, ClaimsType.General]),
			status: new FormControl([claimsStatus.active, claimsStatus.pending]),
			subStatus: new FormControl([]),
			dtpLossFrom: new FormControl(null),
			dtpLossTo: new FormControl(null),
			dtpCreatedOnFrom: new FormControl(null),
			dtpCreatedOnTo: new FormControl(null),
			combOperatorAmount: new FormControl(null),
			paidAmount1: new FormControl(null),
			paidAmount2: new FormControl(null),
			combOperatorUnderProcessingAmount: new FormControl(null),
			underProcesingAmount1: new FormControl(null),
			underProcesingAmount2: new FormControl(null),
			claimNo: new FormControl(null),
			insurCompClaimNo: new FormControl(null),
			blawbNo: new FormControl(null),
			policyNo: new FormControl(null),
			chassisNumber: new FormControl(null),
			policyCertificateNo: new FormControl(null),
			declarationNo: new FormControl(null),
			insurCompany: new FormControl([]),
			savedUser: new FormControl(null),
			invoiceNo: new FormControl(null),
			wipNo: new FormControl(null),
			carNo: new FormControl(null),
			paymentDetails: new FormControl(null),
			nameofInjured: new FormControl(null),
			lossLocation: new FormControl(null),
			shipmentName: new FormControl(null),
			memberDriverName: new FormControl(null),
		});
	}
	get filterF() {
		return this.filterForm.controls;
	}
	getSubStatus() {
		if (this.filterF.status?.value!.length == 0) {
			this.uiState.claims.subStatus = [];
			this.filterF.subStatus?.reset();
			return;
		}
		let sub = this.claimService.getSubStatus(this.filterF.status?.value!).subscribe((res: HttpResponse<IBaseResponse<string[]>>) => {
			this.uiState.claims.subStatus = res.body?.data!;
			this.filterF.subStatus?.patchValue(res.body?.data!);
		});

		this.subscribes.push(sub);
	}
	// get accident / bill date range
	accidentDateRange(e: { from: NgbDate; to: NgbDate }) {
		this.filterF.dtpLossFrom?.patchValue(this.util.dateFormater(e.from));
		this.filterF.dtpLossTo?.patchValue(this.util.dateFormater(e.to));
	}
	//get Create on date range
	createOnDateRange(e: { from: NgbDate; to: NgbDate }) {
		this.filterF.dtpCreatedOnFrom?.patchValue(this.util.dateFormater(e.from));
		this.filterF.dtpCreatedOnTo?.patchValue(this.util.dateFormater(e.to));
	}
	// paid amount
	paidAmount1(e: any) {
		this.filterF.paidAmount1?.patchValue(e.target.value);
	}
	paidAmount2(e: any) {
		this.filterF.paidAmount2?.patchValue(e.target.value);
	}
	resetPaidAmount2() {
		this.filterF.paidAmount2?.reset();
	}

	// under processing amount
	processingAmount1(e: any) {
		this.filterF.underProcesingAmount1?.patchValue(e.target.value);
	}
	processingAmount2(e: any) {
		this.filterF.underProcesingAmount2?.patchValue(e.target.value);
	}
	resetProcAmount2() {
		this.filterF.underProcesingAmount2?.reset();
	}

	submitFilterForm() {
		this.uiState.filters = {
			...this.uiState.filters,
			...this.filterForm.value,
		};
		this.gridApi.setDatasource(this.dataSource);
	}
	//#endregion

	//#region follow up

	openFollowUpCanvas(sNo: number) {
		this.offcanvasService.open(this.followUpCanvas, { position: "end", scroll: false });
		this.getFollowUp(sNo);
		this.initFollowUpForm(sNo.toString());
	}

	initFollowUpForm(sNo: string) {
		this.followUpForm = new FormGroup<IClaimsFollowUpForm>({
			no: new FormControl(sNo),
			names: new FormControl([], Validators.required),
			msg: new FormControl(null, Validators.required),
		});
	}
	get followUpF() {
		return this.followUpForm.controls;
	}

	getFollowUp(sNo: number) {
		let sub = this.claimService.getFollowUp(sNo).subscribe((res: HttpResponse<IBaseResponse<IClaimsFollowUp[]>>) => {
			this.uiState.claims.followUpData = res.body?.data!;
		});
		this.subscribes.push(sub);
	}

	sendFollowUp(form: any) {
		if (!this.followUpForm.valid) {
			this.followUpForm.markAllAsTouched();
			return;
		}
		this.isLoading = true;

		let sub = this.claimService.saveFollowUp(form).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
			if (res.body?.data) {
				this.getFollowUp(form.no);
				this.message.toast(res.body?.message!, "success");
				this.isLoading = false;
			} else {
				this.message.popup("Sorry!", res.body?.message!, "error");
				this.isLoading = false;
			}
		});
		this.subscribes.push(sub);
	}
	//#endregion

	//#region Email

	openEmailModal(data: {}, name: string) {
		switch (name) {
			case "client":
				this.getClientMail(data);
				break;
			case "insurer":
				this.getInsurerMail(data);
				break;
			default:
				return;
		}
	}

	getClientMail(data: {}) {
		let sub = this.claimService.getClientMailData(data).subscribe((res: HttpResponse<IBaseResponse<IEmailResponse>>) => {
			if (res.body?.message == "Success") {
				this.uiState.claims.emailData = res.body?.data!;
				this.email.openModal();
			} else {
				this.message.popup("Sorry!", res.body?.message!, "error");
			}
		});
		this.subscribes.push(sub);
	}
	getInsurerMail(data: {}) {
		let sub = this.claimService.getInsurerMailData(data).subscribe((res: HttpResponse<IBaseResponse<IEmailResponse>>) => {
			if (res.body?.message == "Success") {
				this.uiState.claims.emailData = res.body?.data!;
				this.email.openModal();
			} else {
				this.message.popup("Sorry!", res.body?.message!, "error");
			}
		});
		this.subscribes.push(sub);
	}

	//#endregion

	// #region Summary Section Event Binder
	openDashboard(): void {
		this.canvasRef = this.offcanvasService.open(DashboardClaimsComponent, {
			position: "top",
			panelClass: "claims-panel",
		});
		const sub = this.canvasRef.componentInstance.summaryData.subscribe((res: IActiveClientWithInsuranceClaim) => this.summaryEvtBinder(res));
		this.subscribes.push(sub);
	}

	summaryEvtBinder(e: IActiveClientWithInsuranceClaim) {
		this.filterForm.reset();
		this.filterForm.patchValue({
			clientName: e.clientName,
			status: [claimsStatus.active, claimsStatus.pending],
			claimType: e.claimType,
			insurCompany: e.insuranceCompany,
			subStatus: [],
		});
		this.submitFilterForm();
	}
	//#endregion

	ngOnDestroy(): void {
		this.subscribes.forEach((sub) => sub.unsubscribe);
	}
}
