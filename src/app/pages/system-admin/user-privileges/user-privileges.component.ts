import { Component, ElementRef, OnInit, TemplateRef } from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { Observable, Subscription } from "rxjs";
import { NgbModal, NgbModalRef, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import PerfectScrollbar from "perfect-scrollbar";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { SystemAdminService } from "src/app/shared/services/system-admin/system-admin.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import AppUtils from "src/app/shared/app/util";
import { IUserRoles, IUserRolesForm } from "src/app/shared/app/models/SystemAdmin/system-admin-utils";
import { EventService } from "src/app/core/services/event.service";
import { userRolesCols } from "src/app/shared/app/grid/userRolesCols";
import { reserved } from "src/app/core/models/reservedWord";
import { IUserRolesPrivileges, IUserRolesPrivilegesForm } from "src/app/shared/app/models/SystemAdmin/isystem-admin-privileges";

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
		roles: {
			list: [] as IUserRoles[],
			totalPages: 0,
		},
		privilagesData: {} as IUserRolesPrivileges,
	};
	subscribes: Subscription[] = [];
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		paginationAutoPageSize: true,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: userRolesCols,
		suppressCsvExport: true,
		// paginationPageSize: this.uiState.filters.pageSize,
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

	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();
			let sub = this.systemAdminService.getAllRoles().subscribe(
				(res: HttpResponse<IBaseResponse<IUserRoles[]>>) => {
					this.uiState.roles.list = res.body?.data!;
					params.successCallback(this.uiState.roles.list, this.uiState.roles.list.length);
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
		if ((this, this.uiState.roles.list.length > 0)) this.gridApi.sizeColumnsToFit();
	}
	//#region

	//#region Roles Management

	newRoleModal!: NgbModalRef;
	roleForm!: FormGroup;

	initRoleForm() {
		this.roleForm = new FormGroup<IUserRolesForm>({
			securityRole: new FormControl(null, Validators.required),
			securityRoleDescription: new FormControl(null),
		});
	}

	get f() {
		return this.roleForm.controls;
	}

	openAddRoleModal(content: TemplateRef<any>) {
		this.resetAddRoleForm();
		this.newRoleModal = this.modalService.open(content, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
			backdrop: "static",
		});
		this.newRoleModal.hidden.subscribe(() => {
			this.resetAddRoleForm();
			this.uiState.submitted = false;
		});
	}

	validationChecker(): boolean {
		if (this.roleForm.invalid) {
			this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
			return false;
		}
		return true;
	}

	submitNewRole(form: FormGroup) {
		let data: IUserRoles = {
			sno: 0,
			...form.getRawValue(),
		};
		if (!this.validationChecker()) return;

		this.eventService.broadcast(reserved.isLoading, true);
		let sub = this.systemAdminService.addRole(data).subscribe(
			(res: HttpResponse<IBaseResponse<number>>) => {
				if (res.body?.status) {
					this.message.toast(res.body!.message!, "success");
					this.gridApi.setDatasource(this.dataSource);
					this.newRoleModal.dismiss();
					this.eventService.broadcast(reserved.isLoading, false);
				} else this.message.toast(res.body!.message!, "error");
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
				this.eventService.broadcast(reserved.isLoading, false);
			}
		);
		this.subscribes.push(sub);
	}

	resetAddRoleForm() {
		this.roleForm.reset();
	}

	deleteRole(sno: number) {
		this.eventService.broadcast(reserved.isLoading, true);
		let sub = this.systemAdminService.deleteRole(sno).subscribe(
			(res: HttpResponse<IBaseResponse<number>>) => {
				if (res.body?.status) {
					this.message.toast(res.body!.message!, "success");
					this.gridApi.setDatasource(this.dataSource);
					this.eventService.broadcast(reserved.isLoading, false);
				} else this.message.toast(res.body!.message!, "error");
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
				this.eventService.broadcast(reserved.isLoading, false);
			}
		);
		this.subscribes.push(sub);
	}
	//#endregion

	//#region Privilages Management

	privilegesForm!: FormGroup<IUserRolesPrivilegesForm>;

	initPrivilegesForm() {
		this.privilegesForm = new FormGroup<IUserRolesPrivilegesForm>({
			sNo: new FormControl(0),
			// Master Table Controllers
			chMasterTabels: new FormControl(false),
			chIncuranceClasses: new FormControl(false),
			chCustomerServiceModule: new FormControl(false),
			chInsuranceCompanies: new FormControl(false),
			chProductionBusinessModules: new FormControl(false),
			chInsuranceBrokers: new FormControl(false),
			chClaimsModule: new FormControl(false),
			chTypeProspects: new FormControl(false),
			chListOfRequiredDocuments: new FormControl(false),
			chBusinessActivity: new FormControl(false),
			chContactsListPosition: new FormControl(false),
			chClientsCategories: new FormControl(false),
			chCountries: new FormControl(false),
			chDefaultEmails: new FormControl(false),
			chMasterTablesReadOnly: new FormControl(false),
			chAccessAllProducersSales: new FormControl(false),

			// Business Development Controllers
			chBussDevelopment: new FormControl(false),
			chSalesforceSupport: new FormControl(false),
			chProspectRegistry: new FormControl(false),
			chSalesManagement: new FormControl(false),
			chUnderwritingDepartment: new FormControl(false),
			chBussUnderwritingGeneral: new FormControl(false),
			chBussUnderwritingMedical: new FormControl(false),
			chBusinessReports: new FormControl(false),
			chAccessAllUsersSales: new FormControl(false),
			chAccessAllBranchBussiness: new FormControl(false),
			chPandingSalesLead: new FormControl(false),
			chExpiredLeadsPolices: new FormControl(false),
			chBusinessDevelopmentReadOnly: new FormControl(false),

			// Client Registry
			chClientsRegistryAdmin: new FormControl(false),
			chClientsRegistry: new FormControl(false),
			chClientsGrouping: new FormControl(false),
			chAccessAllClients: new FormControl(false),
			chAccessAllProducersClients: new FormControl(false),
			chClientsRegistryAdministratorReadOnly: new FormControl(false),

			// Production
			chProduction: new FormControl(false),
			chProdPolicies: new FormControl(false),
			chEntryCorrection: new FormControl(false),
			chProdEntryApproval: new FormControl(false),
			chProdReports: new FormControl(false),
			viewAllBranchs: new FormControl(false),
			chAccessAllProducersProduction: new FormControl(false),
			chProductionAccessAllUsers: new FormControl(false),
			chUpdateClientDNCNCompCNDN: new FormControl(false),
			chUpdateDeliveryStatus: new FormControl(false),
			chChangeProducerComm: new FormControl(false),
			chModifyCommOut: new FormControl(false),
			chHideCompanyCommission: new FormControl(false),
			chHideProducerCommission: new FormControl(false),
			chExpiredPolices: new FormControl(false),
			cHduePayments: new FormControl(false),
			chProductionReadOnly: new FormControl(false),

			// Customer Service
			chCustomerService: new FormControl(false),
			chRequestsManagements: new FormControl(false),
			chCustSerReports: new FormControl(false),
			chAccessAllUsersCustomer: new FormControl(false),
			chAccessAllBrancheCustomer: new FormControl(false),
			chCSEntryCorrection: new FormControl(false),
			chComplaintsRegistry: new FormControl(false),
			chOnlineRequests: new FormControl(false),
			chAlertCustomerServiceDeadline: new FormControl(false),
			chCustomerServiceReadOnly: new FormControl(false),

			// Claims Management
			chClaims: new FormControl(false),
			chClaimsManagement: new FormControl(false),
			chClaimsPaymentApproval: new FormControl(false),
			chClaimsReport: new FormControl(false),
			chAccessAllUsersClaim: new FormControl(false),
			chAccessAllBrancheClaim: new FormControl(false),
			chAlertClaimReminder: new FormControl(false),
			chClaimsManagementSystemReadOnly: new FormControl(false),

			// Finance Management
			chFinance: new FormControl(false),
			// MakeNew
			chFinMakeNew: new FormControl(false),
			chFinMakeJV: new FormControl(false),
			chFinMakeReceipt: new FormControl(false),
			chFinMakePay: new FormControl(false),
			chFinMakeReverse: new FormControl(false),
			// --------
			// Archives
			chFinArchive: new FormControl(false),
			chFinReceiptArchive: new FormControl(false),
			chFinPayArchive: new FormControl(false),
			chFinDNsArchive: new FormControl(false),
			chFinCNsArchive: new FormControl(false),
			// --------
			// approvals
			chFinApprovals: new FormControl(false),
			chFinanceEntryApproval: new FormControl(false),
			chFinReceiptApprovals: new FormControl(false),
			chFinPayApprovals: new FormControl(false),
			chProdFinancialApprove: new FormControl(false),
			chClaimsApproval: new FormControl(false),
			chClientsApproval: new FormControl(false),
			// --------
			// Reports
			chFinReports: new FormControl(false),
			chTrialBalance: new FormControl(false),
			chProftAndLoss: new FormControl(false),
			chStatementOfAccount: new FormControl(false),
			// --------
			chFinSettings: new FormControl(false),
			chDataLock: new FormControl(false),
			chFinDisableAccounts: new FormControl(false),
			chAccessConfidentialAccounts: new FormControl(false),
			chAccessAllBrancheFin: new FormControl(false),
			chFinancialManagementSystemReadOnly: new FormControl(false),

			// Fixed Assets
			chFixedAssets: new FormControl(false),
			chFixedAssetsReadOnly: new FormControl(false),

			// System Admin
			chSystemAdmin: new FormControl(false),
			chUsersMang: new FormControl(false),
			chSMSControlPanel: new FormControl(false),
			chEmailsLog: new FormControl(false),

			// Human Resources
			chHR: new FormControl(false),
			chPayroll: new FormControl(false),
			chLoansManagement: new FormControl(false),
			chGovernmentExpenses: new FormControl(false),
			chHealthInsurance: new FormControl(false),
			chAirTickets: new FormControl(false),
			chRetroactiveManagement: new FormControl(false),
			chMobileAllowances: new FormControl(false),
			chSchoolAllowanceManagement: new FormControl(false),
			chOvertime: new FormControl(false),
			chBonusManagement: new FormControl(false),
			chDeductibles: new FormControl(false),
			chGeneratePayroll: new FormControl(false),
			chActivatePayroll: new FormControl(false),
			chPayrollArchive: new FormControl(false),
			chHoldSalary: new FormControl(false),
			chStaffProfiles: new FormControl(false),
			chJobsOffersManagement: new FormControl(false),
			chStaffContracts: new FormControl(false),
			chLegalLicenseAndOfficialServices: new FormControl(false),
			chVacationsManagement: new FormControl(false),

			// chAccessAllProducers: new FormControl(false),
			// chInsurClass: new FormControl(false),
			// chProdRetail: new FormControl(false),
			// chMasterInsClassesLines: new FormControl(false),
			// chMasterInsCompanies: new FormControl(false),
			// chBussDevProspects: new FormControl(false),
			chAccessAllUsersCSRequests: new FormControl(false),
			chCustSerRequests: new FormControl(false),
			chBussDevUnderwritingMedical: new FormControl(false),
			chBussDevUnderwriting: new FormControl(false),
			chBussDevSales: new FormControl(false),
			chAccessAllUsersSalesLeads: new FormControl(false),
			chMasterProductionLibararies: new FormControl(false),
			chMasterClaimsModule: new FormControl(false),
			chMasterDefaultEmails: new FormControl(false),
			chMasterCustServiceModule: new FormControl(false),
			chMasterInsBrokers: new FormControl(false),
			chProdCommercial: new FormControl(false),
			chApprovClientCreation: new FormControl(false),
			chProdIndividual: new FormControl(false),
			chSearchEngine: new FormControl(false),
			chShowComanyCommission: new FormControl(false),
			chShowProducerCommission: new FormControl(false),
			chProdTargets: new FormControl(false),
			chSales: new FormControl(false),
			chSlipMng: new FormControl(false),
			chProspReAssign: new FormControl(false),
			chProspMangFollowUp: new FormControl(false),
			chProspReport: new FormControl(false),
			chRenewAssign: new FormControl(false),
			chRenewMangFollowUp: new FormControl(false),
			chRenewReport: new FormControl(false),
			chClaimsDelManger: new FormControl(false),
			chClaimsDelCorrec: new FormControl(false),
			chClaimsMng: new FormControl(false),
			chClaimsConfirmCN: new FormControl(false),
			chClaimsReports: new FormControl(false),
			chReActivateClaims: new FormControl(false),
			chClaimsFollowup: new FormControl(false),
			reports: new FormControl(false),
			chUnderwriting: new FormControl(false),
			chUnderRequests: new FormControl(false),
			chFinReviewJV: new FormControl(false),
			chFinReviewReceipt: new FormControl(false),
			chFinancialManager: new FormControl(false),
			chFinReviewPay: new FormControl(false),
			chFinanceRenameAccounts: new FormControl(false),

			chVacApprovalDeptManager: new FormControl(false),
			chApprovalDeptManager: new FormControl(false),
			chCLaimManagerAppr: new FormControl(false),
			chApproval: new FormControl(false),
			chCloseFinancialYear: new FormControl(false),
			alert: new FormControl(false),
			productionCombExpApprove: new FormControl(false),
			leadCurrentPolicies: new FormControl(false),
			stampedPolicy: new FormControl(false),
			chAuditAndReview: new FormControl(false),
			chProducersPaymnets: new FormControl(false),
			chClientsPaymentsManager: new FormControl(false),
			chProducers: new FormControl(false),
			chAccountManager: new FormControl(false),
			chClosingPeriod: new FormControl(false),
			chNewReverseVoucher: new FormControl(false),
			chEditingCorrecting: new FormControl(false),
			chEditJournalVouchers: new FormControl(false),
			chEditReceiptVoucher: new FormControl(false),
			chEditPayVouchers: new FormControl(false),
			chManageChartofAccounts: new FormControl(false),
			chRenameAnAccount: new FormControl(false),
			chDifferentInExchange: new FormControl(false),
			chAllocationClearing: new FormControl(false),
			chApproveInsuranceCompany: new FormControl(false),
			chApprovingFinVouchersJV: new FormControl(false),
			chApprovingFinVouchersRV: new FormControl(false),
			chApprovingFinVouchersPV: new FormControl(false),
			chApprovingFinVouchersReverse: new FormControl(false),
			chIncidents: new FormControl(false),
			chAppraisalForm: new FormControl(false),
			chReports: new FormControl(false),
			chSettings: new FormControl(false),
			chHRDeleteApprovedEntries: new FormControl(false),
			chDepartmentVacations: new FormControl(false),
			chVacationsRequest: new FormControl(false),
			chhrAlarms: new FormControl(false),
			chAlertExpiringLegal: new FormControl(false),
			chAlertExpiringVisa: new FormControl(false),
			chAlertExpiringPassport: new FormControl(false),
			chAlertExpiringID: new FormControl(false),
			chAlertExpiringLabours: new FormControl(false),
			chAlertExpiringContracts: new FormControl(false),
			chProductionEntryApproval: new FormControl(false),
			chDeleteFollowUp: new FormControl(false),
			chPReactivated: new FormControl(false),
			chHRReadOnly: new FormControl(false),
			chSystemAdminReadOnly: new FormControl(false),
			chRenameStaffName: new FormControl(false),
			chSalaryandBenefits: new FormControl(false),
			chLetterWarning: new FormControl(false),
			chLetterEmbassy: new FormControl(false),
			chLetterEndofService: new FormControl(false),
			chLetterEffectiveDateNotice: new FormControl(false),
			chLetterEmployment: new FormControl(false),
			chLetterSalaryTransfer: new FormControl(false),
			chLetterSalaryDefinition: new FormControl(false),
			chLetterReleaseandDischargeForm: new FormControl(false),
			chLetterJoiningLetters: new FormControl(false),
			chLetterSponsorshipTransfer: new FormControl(false),
			chLetterTemporaryProfile: new FormControl(false),
			chLetterFieldApplication: new FormControl(false),
			chLetterAuthorization: new FormControl(false),
			chEndofService: new FormControl(false),
			chLetters: new FormControl(false),
			chAlertVacationRequest: new FormControl(false),
			chAlertLeaveRequest: new FormControl(false),
			chAlertRemindinglegal: new FormControl(false),
			chAlertExpiringProbation: new FormControl(false),
			chAlertDueContracts: new FormControl(false),
			chEnabledStatusRequst: new FormControl(false),
			chAccessAllUsers: new FormControl(false),
		});
	}

	// for (let c in this.privilegesForm.controls) {
	// 	console.log("first");
	// 	console.log(c);
	// }

	getAllPrivileges(sno: number) {
		this.eventService.broadcast(reserved.isLoading, true);
		let sub = this.systemAdminService.getAllPrivileges(sno).subscribe(
			(res: HttpResponse<IBaseResponse<IUserRolesPrivileges>>) => {
				if (res.body?.status) {
					this.message.toast(res.body!.message!, "success");
					this.uiState.privilagesData = res.body?.data!;
					this.eventService.broadcast(reserved.isLoading, false);
				} else this.message.toast(res.body!.message!, "error");
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
				this.eventService.broadcast(reserved.isLoading, false);
			}
		);
		this.subscribes.push(sub);
	}

	submitPrivilegesForm(form: FormGroup) {}

	//#endregion

	ngOnInit(): void {
		this.initRoleForm();
		this.initPrivilegesForm();
	}
}
