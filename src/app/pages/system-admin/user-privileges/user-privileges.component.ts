import { Component, ElementRef, OnInit, TemplateRef } from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { Observable, Subscription } from "rxjs";
import { NgbModal, NgbModalRef, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { SystemAdminService } from "src/app/shared/services/system-admin/system-admin.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import AppUtils from "src/app/shared/app/util";
import { IUserRoles, IUserRolesForm, privilegeRole } from "src/app/shared/app/models/SystemAdmin/system-admin-utils";
import { EventService } from "src/app/core/services/event.service";
import { userRolesCols } from "src/app/shared/app/grid/userRolesCols";
import { reserved } from "src/app/core/models/reservedWord";
import {
	IUserRolesPrivileges,
	IUserRolesPrivilegesBoolean,
	IUserRolesPrivilegesForm,
} from "src/app/shared/app/models/SystemAdmin/isystem-admin-privileges";

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
		convertedPrivilagesData: {} as IUserRolesPrivilegesBoolean,
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
		} else {
			this.getAllPrivileges(params.data.sno);
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
		if ((this, this.uiState.roles.list.length > 0)) this.gridApi.sizeColumnsToFit();
	}
	//#region

	//#region Roles Management

	newRoleModal!: NgbModalRef;
	roleForm!: FormGroup<IUserRolesForm>;

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
			// this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
			return false;
		}
		return true;
	}

	submitNewRole(form: FormGroup) {
		this.uiState.submitted = true;
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
		this.uiState.submitted = false;
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

	globalArrs!: {
		MasterTable: privilegeRole[];
		BussinessDevelopment: privilegeRole[];
		ClientRegistry: privilegeRole[];
		Production: privilegeRole[];
		CustomerService: privilegeRole[];
		ClaimsManagement: privilegeRole[];
		FinancialManagement: {
			generalRoles: privilegeRole[];
			makeNewRoles: privilegeRole[];
			archivesRoles: privilegeRole[];
			approvalsRoles: privilegeRole[];
			reportsRoles: privilegeRole[];
		};
		HumanResources: {
			generalRoles: privilegeRole[];
			payrollRoles: privilegeRole[];
		};
		FixedAssets: privilegeRole[];
		SysAdmin: privilegeRole[];
	};

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
			chVacationsRequest: new FormControl(false),
			chHRDeleteApprovedEntries: new FormControl(false),
			chReports: new FormControl(false),
			chApproval: new FormControl(false),
			chAppraisalForm: new FormControl(false),
			chSettings: new FormControl(false),
			chRenameStaffName: new FormControl(false),
			chIncidents: new FormControl(false),
			chEndofService: new FormControl(false),
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
			chAlertExpiringID: new FormControl(false),
			chAlertExpiringPassport: new FormControl(false),
			chAlertExpiringLabours: new FormControl(false),
			chAlertExpiringContracts: new FormControl(false),
			chAlertExpiringLegal: new FormControl(false),
			chAlertVacationRequest: new FormControl(false),
			chAlertLeaveRequest: new FormControl(false),
			chAlertRemindinglegal: new FormControl(false),
			chAlertExpiringProbation: new FormControl(false),
			chAlertDueContracts: new FormControl(false),
			chHRReadOnly: new FormControl(false),

			// Unused Privileges
			chAccessAllProducers: new FormControl(false),
			chInsurClass: new FormControl(false),
			chProdRetail: new FormControl(false),
			chMasterInsClassesLines: new FormControl(false),
			chMasterInsCompanies: new FormControl(false),
			chBussDevProspects: new FormControl(false),
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
			chSalaryandBenefits: new FormControl(false),
			chVacApprovalDeptManager: new FormControl(false),
			chApprovalDeptManager: new FormControl(false),
			chCLaimManagerAppr: new FormControl(false),
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
			chDepartmentVacations: new FormControl(false),
			chhrAlarms: new FormControl(false),
			chAlertExpiringVisa: new FormControl(false),
			chProductionEntryApproval: new FormControl(false),
			chDeleteFollowUp: new FormControl(false),
			chPReactivated: new FormControl(false),
			chSystemAdminReadOnly: new FormControl(false),
			chLetters: new FormControl(false),
			chEnabledStatusRequst: new FormControl(false),
			chAccessAllUsers: new FormControl(false),
			activePrivileges: new FormArray([]),
		});

		this.globalArrs = {
			MasterTable: [
				{
					control: this.ff.chMasterTabels!,
					name: "chMasterTabels",
					label: "Master Tables",
				},
				{
					control: this.ff.chMasterTablesReadOnly!,
					name: "chMasterTablesReadOnly",
					label: "Read-Only",
				},
				{
					control: this.ff.chIncuranceClasses!,
					name: "chIncuranceClasses",
					label: "Insurance Classes/Lines of Bussiness",
				},
				{
					control: this.ff.chInsuranceCompanies!,
					name: "chInsuranceCompanies",
					label: "Insurance Companies",
				},
				{
					control: this.ff.chProductionBusinessModules!,
					name: "chProductionBusinessModules",
					label: "Production/Business Modules",
				},
				{
					control: this.ff.chInsuranceBrokers!,
					name: "chInsuranceBrokers",
					label: "Insurance Brokers",
				},
				{
					control: this.ff.chClaimsModule!,
					name: "chClaimsModule",
					label: "Claims Modules",
				},
				{
					control: this.ff.chCustomerServiceModule!,
					name: "chCustomerServiceModule",
					label: "Customer Service Module",
				},
				{
					control: this.ff.chTypeProspects!,
					name: "chTypeProspects",
					label: "Type Prospects",
				},
				{
					control: this.ff.chListOfRequiredDocuments!,
					name: "chListOfRequiredDocuments",
					label: "List of Required Documents",
				},
				{
					control: this.ff.chBusinessActivity!,
					name: "chBusinessActivity",
					label: "Business Activity",
				},
				{
					control: this.ff.chContactsListPosition!,
					name: "chContactsListPosition",
					label: "Contacts List Position",
				},
				{
					control: this.ff.chClientsCategories!,
					name: "chClientsCategories",
					label: "Clients Categories",
				},
				{
					control: this.ff.chCountries!,
					name: "chCountries",
					label: "Countries",
				},
				{
					control: this.ff.chDefaultEmails!,
					name: "chDefaultEmails",
					label: "Default Emails",
				},
			],
			BussinessDevelopment: [
				{
					control: this.ff.chBussDevelopment!,
					name: "chBussDevelopment",
					label: "Bussiness Development",
				},
				{
					control: this.ff.chBusinessDevelopmentReadOnly!,
					name: "chBusinessDevelopmentReadOnly",
					label: "Read-Only",
				},
				{
					control: this.ff.chSalesforceSupport!,
					name: "chSalesforceSupport",
					label: "Salesforce Support",
				},
				{
					control: this.ff.chProspectRegistry!,
					name: "chProspectRegistry",
					label: "Prospects Registery",
				},
				{
					control: this.ff.chSalesManagement!,
					name: "chSalesManagement",
					label: "Sales Management",
				},
				{
					control: this.ff.chUnderwritingDepartment!,
					name: "chUnderwritingDepartment",
					label: " Underwriting Department",
				},
				{
					control: this.ff.chBussUnderwritingGeneral!,
					name: "chBussUnderwritingGeneral",
					label: "Underwriting Department General",
				},
				{
					control: this.ff.chBussUnderwritingMedical!,
					name: "chBussUnderwritingMedical",
					label: "Underwriting Department Medical",
				},
				{
					control: this.ff.chBusinessReports!,
					name: "chBusinessReports",
					label: "Business Reports",
				},
				{
					control: this.ff.chAccessAllUsersSales!,
					name: "chAccessAllUsersSales",
					label: "Access All Users Sales",
				},
				{
					control: this.ff.chAccessAllProducersSales!,
					name: "chAccessAllProducersSales",
					label: "Access All Producers",
				},
				{
					control: this.ff.chAccessAllBranchBussiness!,
					name: "chAccessAllBranchBussiness",
					label: "Access All Branch",
				},
				{
					control: this.ff.chPandingSalesLead!,
					name: "chPandingSalesLead",
					label: "Show Underwriters Alert",
				},
				{
					control: this.ff.chExpiredLeadsPolices!,
					name: "chExpiredLeadsPolices",
					label: "Show Expired Leads Policies Alert",
				},
			],
			ClientRegistry: [
				{
					control: this.ff.chClientsRegistryAdmin!,
					name: "chClientsRegistryAdmin",
					label: "Clients Registery",
				},
				{
					control: this.ff.chClientsRegistryAdministratorReadOnly!,
					name: "chClientsRegistryAdministratorReadOnly",
					label: "Read-Only",
				},
				{
					control: this.ff.chClientsRegistry!,
					name: "chClientsRegistry",
					label: "Clients Registery",
				},
				{
					control: this.ff.chClientsGrouping!,
					name: "chClientsGrouping",
					label: "Clients Grouping",
				},
				{
					control: this.ff.chAccessAllClients!,
					name: "chAccessAllClients",
					label: "Access All Clients",
				},
				{
					control: this.ff.chAccessAllProducersClients!,
					name: "chAccessAllProducersClients",
					label: " Access All Producers",
				},
			],
			Production: [
				{
					control: this.ff.chProduction!,
					name: "chProduction",
					label: "Production",
				},
				{
					control: this.ff.chProductionReadOnly!,
					name: "chProductionReadOnly",
					label: "Read-Only",
				},
				{
					control: this.ff.chProdPolicies!,
					name: "chProdPolicies",
					label: "Polices/Endorsments Management",
				},
				{
					control: this.ff.chEntryCorrection!,
					name: "chEntryCorrection",
					label: "Entry correction",
				},
				{
					control: this.ff.chProdEntryApproval!,
					name: "chProdEntryApproval",
					label: "Production Entry correction",
				},
				{
					control: this.ff.chProdReports!,
					name: "chProdReports",
					label: "Production Reports",
				},
				{
					control: this.ff.viewAllBranchs!,
					name: "viewAllBranchs",
					label: "Access all Branches",
				},
				{
					control: this.ff.chAccessAllProducersProduction!,
					name: "chAccessAllProducersProduction",
					label: "Access all Producers",
				},
				{
					control: this.ff.chProductionAccessAllUsers!,
					name: "chProductionAccessAllUsers",
					label: "Access All User",
				},
				{
					control: this.ff.chUpdateClientDNCNCompCNDN!,
					name: "chUpdateClientDNCNCompCNDN",
					label: "Update Client DN/CN and Comp CN/DN",
				},
				{
					control: this.ff.chUpdateDeliveryStatus!,
					name: "chUpdateDeliveryStatus",
					label: "Update Delivery Status",
				},
				{
					control: this.ff.chChangeProducerComm!,
					name: "chChangeProducerComm",
					label: "Change Producers Commission",
				},
				{
					control: this.ff.chModifyCommOut!,
					name: "chModifyCommOut",
					label: "Update Commission Out",
				},
				{
					control: this.ff.chHideCompanyCommission!,
					name: "chHideCompanyCommission",
					label: "Hide Company Commission",
				},
				{
					control: this.ff.chHideProducerCommission!,
					name: "chHideProducerCommission",
					label: "Hide Producers Commission",
				},
				{
					control: this.ff.chExpiredPolices!,
					name: "chExpiredPolices",
					label: "Alert Show Expired Polices",
				},
				{
					control: this.ff.cHduePayments!,
					name: "cHduePayments",
					label: "Alert Show Due Payments",
				},
			],
			CustomerService: [
				{
					control: this.ff.chCustomerService!,
					name: "chCustomerService",
					label: "Customer Service",
				},
				{
					control: this.ff.chCustomerServiceReadOnly!,
					name: "chCustomerServiceReadOnly",
					label: "Read-Only",
				},
				{
					control: this.ff.chRequestsManagements!,
					name: "chRequestsManagements",
					label: "Requests Mangement",
				},
				{
					control: this.ff.chCustSerReports!,
					name: "chCustSerReports",
					label: "Reports",
				},
				{
					control: this.ff.chAccessAllUsersCustomer!,
					name: "chAccessAllUsersCustomer",
					label: "Access All User",
				},
				{
					control: this.ff.chAccessAllBrancheCustomer!,
					name: "chAccessAllBrancheCustomer",
					label: "Access All Branches",
				},
				{
					control: this.ff.chCSEntryCorrection!,
					name: "chCSEntryCorrection",
					label: "Entery Correction",
				},
				{
					control: this.ff.chComplaintsRegistry!,
					name: "chComplaintsRegistry",
					label: "Complaints Regisery",
				},
				{
					control: this.ff.chOnlineRequests!,
					name: "chOnlineRequests",
					label: "Online Requests",
				},
				{
					control: this.ff.chAlertCustomerServiceDeadline!,
					name: "chAlertCustomerServiceDeadline",
					label: "Alert Customer Service Deadline",
				},
			],
			ClaimsManagement: [
				{
					control: this.ff.chClaims!,
					name: "chClaims",
					label: "Claims Management System",
				},
				{
					control: this.ff.chClaimsManagementSystemReadOnly!,
					name: "chClaimsManagementSystemReadOnly",
					label: "Read-Only",
				},
				{
					control: this.ff.chClaimsManagement!,
					name: "chClaimsManagement",
					label: "Claims Management",
				},
				{
					control: this.ff.chClaimsPaymentApproval!,
					name: "chClaimsPaymentApproval",
					label: "Claims Payment Approval",
				},
				{
					control: this.ff.chClaimsReport!,
					name: "chClaimsReport",
					label: "Reports",
				},
				{
					control: this.ff.chAccessAllUsersClaim!,
					name: "chAccessAllUsersClaim",
					label: "Access All Users",
				},
				{
					control: this.ff.chAccessAllBrancheClaim!,
					name: "chAccessAllBrancheClaim",
					label: "Access All Branches",
				},
				{
					control: this.ff.chAlertClaimReminder!,
					name: "chAlertClaimReminder",
					label: "Alert Claim Reminder",
				},
			],
			FinancialManagement: {
				generalRoles: [
					{
						control: this.ff.chFinSettings!,
						name: "chFinSettings",
						label: "Settings",
					},
					{
						control: this.ff.chDataLock!,
						name: "chDataLock",
						label: "Data Lock",
					},
					{
						control: this.ff.chFinDisableAccounts!,
						name: "chFinDisableAccounts",
						label: "Disable/Enable Account",
					},
					{
						control: this.ff.chAccessConfidentialAccounts!,
						name: "chAccessConfidentialAccounts",
						label: "Access Confidential Account",
					},
					{
						control: this.ff.chAccessAllBrancheFin!,
						name: "chAccessAllBrancheFin",
						label: "Access All Branches",
					},
				],
				makeNewRoles: [
					{
						control: this.ff.chFinMakeNew!,
						name: "chFinMakeNew",
						label: "Make New",
					},
					{
						control: this.ff.chFinMakeJV!,
						name: "chFinMakeJV",
						label: "Journal Voucher",
					},
					{
						control: this.ff.chFinMakeReceipt!,
						name: "chFinMakeReceipt",
						label: "Receipt Voucher",
					},
					{
						control: this.ff.chFinMakePay!,
						name: "chFinMakePay",
						label: "Pay Voucher",
					},
					{
						control: this.ff.chFinMakeReverse!,
						name: "chFinMakeReverse",
						label: "Reverse Voucher",
					},
				],
				archivesRoles: [
					{
						control: this.ff.chFinArchive!,
						name: "chFinArchive",
						label: "Archives",
					},
					{
						control: this.ff.chFinReceiptArchive!,
						name: "chFinReceiptArchive",
						label: "Receipt Voucher",
					},
					{
						control: this.ff.chFinPayArchive!,
						name: "chFinPayArchive",
						label: "Pay Voucher",
					},
					{
						control: this.ff.chFinDNsArchive!,
						name: "chFinDNsArchive",
						label: "Debit Notes",
					},
					{
						control: this.ff.chFinCNsArchive!,
						name: "chFinCNsArchive",
						label: "Credit Notes",
					},
				],
				approvalsRoles: [
					{
						control: this.ff.chFinApprovals!,
						name: "chFinApprovals",
						label: "Approvals",
					},
					{
						control: this.ff.chFinanceEntryApproval!,
						name: "chFinanceEntryApproval",
						label: "Journal Voucher Approval",
					},
					{
						control: this.ff.chFinReceiptApprovals!,
						name: "chFinReceiptApprovals",
						label: "Receipt Vouchers Approve",
					},
					{
						control: this.ff.chFinPayApprovals!,
						name: "chFinPayApprovals",
						label: "Pay Vouchers Approve",
					},
					{
						control: this.ff.chProdFinancialApprove!,
						name: "chProdFinancialApprove",
						label: "Production Entry Approvals",
					},
					{
						control: this.ff.chClaimsApproval!,
						name: "chClaimsApproval",
						label: "Claims Payments Approvals",
					},
					{
						control: this.ff.chClientsApproval!,
						name: "chClientsApproval",
						label: "Clients Approvals",
					},
				],
				reportsRoles: [
					{
						control: this.ff.chFinReports!,
						name: "chFinReports",
						label: "Reports",
					},
					{
						control: this.ff.chTrialBalance!,
						name: "chTrialBalance",
						label: "Trial Balance",
					},
					{
						control: this.ff.chProftAndLoss!,
						name: "chProftAndLoss",
						label: "Profile and Loss",
					},
					{
						control: this.ff.chStatementOfAccount!,
						name: "chStatementOfAccount",
						label: "Statement of Account",
					},
				],
			},
			HumanResources: {
				generalRoles: [
					{
						control: this.ff.chStaffProfiles!,
						name: "chStaffProfiles",
						label: "Staff Profiles",
					},
					{
						control: this.ff.chJobsOffersManagement!,
						name: "chJobsOffersManagement",
						label: "Job Offers Management",
					},
					{
						control: this.ff.chStaffContracts!,
						name: "chStaffContracts",
						label: "Staff Contracts",
					},
					{
						control: this.ff.chLegalLicenseAndOfficialServices!,
						name: "chLegalLicenseAndOfficialServices",
						label: "Legal License & Offical Services",
					},
					{
						control: this.ff.chVacationsManagement!,
						name: "chVacationsManagement",
						label: "Vacations Management",
					},
					{
						control: this.ff.chVacationsRequest!,
						name: "chVacationsRequest",
						label: "Vacations Requests",
					},
					{
						control: this.ff.chHRDeleteApprovedEntries!,
						name: "chHRDeleteApprovedEntries",
						label: "Delete Approved Entries",
					},
					{
						control: this.ff.chReports!,
						name: "chReports",
						label: "Reports",
					},
					{
						control: this.ff.chApproval!,
						name: "chApproval",
						label: "Approval",
					},
					{
						control: this.ff.chAppraisalForm!,
						name: "chAppraisalForm",
						label: "Appraisal Form",
					},
					{
						control: this.ff.chSettings!,
						name: "chSettings",
						label: "Settings",
					},
					{
						control: this.ff.chRenameStaffName!,
						name: "chRenameStaffName",
						label: "Rename Staff Names",
					},
					{
						control: this.ff.chIncidents!,
						name: "chIncidents",
						label: "Incidents",
					},
					{
						control: this.ff.chSalaryandBenefits!,
						name: "chSalaryandBenefits",
						label: "Salary and Benefits",
					},
					{
						control: this.ff.chEndofService!,
						name: "chEndofService",
						label: "End Of Service",
					},
					{
						control: this.ff.chLetterWarning!,
						name: "chLetterWarning",
						label: "Warning",
					},
					{
						control: this.ff.chLetterEmbassy!,
						name: "chLetterEmbassy",
						label: "Embassy",
					},
					{
						control: this.ff.chLetterEndofService!,
						name: "chLetterEndofService",
						label: "End of Service Letter",
					},
					{
						control: this.ff.chLetterEffectiveDateNotice!,
						name: "chLetterEffectiveDateNotice",
						label: "Effective Date Notice",
					},
					{
						control: this.ff.chLetterEmployment!,
						name: "chLetterEmployment",
						label: "Employment",
					},
					{
						control: this.ff.chLetterSalaryTransfer!,
						name: "chLetterSalaryTransfer",
						label: "Salary Transfer",
					},
					{
						control: this.ff.chLetterSalaryDefinition!,
						name: "chLetterSalaryDefinition",
						label: "Salary Definition",
					},
					{
						control: this.ff.chLetterReleaseandDischargeForm!,
						name: "chLetterReleaseandDischargeForm",
						label: "Release and Discharge Form",
					},
					{
						control: this.ff.chLetterJoiningLetters!,
						name: "chLetterJoiningLetters",
						label: "Joining Letters",
					},
					{
						control: this.ff.chLetterSponsorshipTransfer!,
						name: "chLetterSponsorshipTransfer",
						label: "Sponsorship Transfer Letters",
					},
					{
						control: this.ff.chLetterTemporaryProfile!,
						name: "chLetterTemporaryProfile",
						label: "Temporary Profile Letters",
					},
					{
						control: this.ff.chLetterTemporaryProfile!,
						name: "chLetterTemporaryProfile",
						label: "Field Application Letters",
					},
					{
						control: this.ff.chLetterAuthorization!,
						name: "chLetterAuthorization",
						label: "Authorization Letters",
					},
					{
						control: this.ff.chAlertExpiringID!,
						name: "chAlertExpiringID",
						label: "IDs Expiry",
					},
					{
						control: this.ff.chAlertExpiringPassport!,
						name: "chAlertExpiringPassport",
						label: "Passports Expiry",
					},
					{
						control: this.ff.chAlertExpiringLabours!,
						name: "chAlertExpiringLabours",
						label: "Labours Expiry",
					},
					{
						control: this.ff.chAlertExpiringContracts!,
						name: "chAlertExpiringContracts",
						label: "Contracts Expiry",
					},
					{
						control: this.ff.chAlertExpiringLegal!,
						name: "chAlertExpiringLegal",
						label: "Legal License Expiry",
					},
					{
						control: this.ff.chAlertVacationRequest!,
						name: "chAlertVacationRequest",
						label: "Alert Vacation Request",
					},
					{
						control: this.ff.chAlertLeaveRequest!,
						name: "chAlertLeaveRequest",
						label: "Alert Leave Request",
					},
					{
						control: this.ff.chAlertRemindinglegal!,
						name: "chAlertRemindinglegal",
						label: "Alert Reminding legal",
					},
					{
						control: this.ff.chAlertExpiringProbation!,
						name: "chAlertExpiringProbation",
						label: "Alert Expiring Probation",
					},
					{
						control: this.ff.chAlertDueContracts!,
						name: "chAlertDueContracts",
						label: "Alert Due Contracts",
					},
				],
				payrollRoles: [
					{
						control: this.ff.chPayroll!,
						name: "chPayroll",
						label: "Payroll",
					},
					{
						control: this.ff.chLoansManagement!,
						name: "chLoansManagement",
						label: "Loans Management",
					},
					{
						control: this.ff.chGovernmentExpenses!,
						name: "chGovernmentExpenses",
						label: "Government Expenses",
					},
					{
						control: this.ff.chHealthInsurance!,
						name: "chHealthInsurance",
						label: "Health Insurance",
					},
					{
						control: this.ff.chAirTickets!,
						name: "chAirTickets",
						label: "Air Tickets",
					},
					{
						control: this.ff.chRetroactiveManagement!,
						name: "chRetroactiveManagement",
						label: "Retroactive Management",
					},
					{
						control: this.ff.chMobileAllowances!,
						name: "chMobileAllowances",
						label: "Mobile Allowances",
					},
					{
						control: this.ff.chSchoolAllowanceManagement!,
						name: "chSchoolAllowanceManagement",
						label: "School Allowances Management",
					},
					{
						control: this.ff.chOvertime!,
						name: "chOvertime",
						label: "Overtime",
					},
					{
						control: this.ff.chBonusManagement!,
						name: "chBonusManagement",
						label: "Bonus Management",
					},
					{
						control: this.ff.chDeductibles!,
						name: "chDeductibles",
						label: "Deductibles",
					},
					{
						control: this.ff.chGeneratePayroll!,
						name: "chGeneratePayroll",
						label: "Generate Payroll",
					},
					{
						control: this.ff.chActivatePayroll!,
						name: "chActivatePayroll",
						label: "Activate Payroll",
					},
					{
						control: this.ff.chPayrollArchive!,
						name: "chPayrollArchive",
						label: "Payroll Archive",
					},
					{
						control: this.ff.chHoldSalary!,
						name: "chHoldSalary",
						label: "Hold Salary",
					},
				],
			},
			FixedAssets: [
				{
					control: this.ff.chFixedAssets!,
					name: "chFixedAssets",
					label: "Fixed Assets",
				},
				{
					control: this.ff.chFixedAssetsReadOnly!,
					name: "chFixedAssetsReadOnly",
					label: "Read-Only",
				},
			],
			SysAdmin: [
				{
					control: this.ff.chSystemAdmin!,
					name: "chSystemAdmin",
					label: "System Admin",
				},
				{
					control: this.ff.chUsersMang!,
					name: "chUsersMang",
					label: "User Accounts Management",
				},
				{
					control: this.ff.chSMSControlPanel!,
					name: "chSMSControlPanel",
					label: "SMS Control Panal",
				},
				{
					control: this.ff.chEmailsLog!,
					name: "chEmailsLog",
					label: "Emails Log",
				},
			],
		};
	}

	get ff() {
		return this.privilegesForm.controls;
	}

	allItemsChecker(modulName: string, val: boolean) {
		switch (modulName) {
			case "MasterTable":
				this.globalArrs.MasterTable.forEach((item: privilegeRole) => {
					if (item.name != "chMasterTablesReadOnly" && val === true) item.control.patchValue(true);
					else item.control.patchValue(false);
				});
				break;
			case "BussinessDevelopment":
				this.globalArrs.BussinessDevelopment.forEach((item: privilegeRole) => {
					if (item.name != "chBusinessDevelopmentReadOnly" && val === true) item.control.patchValue(true);
					else item.control.patchValue(false);
				});
				break;
			case "ClientRegistry":
				this.globalArrs.ClientRegistry.forEach((item: privilegeRole) => {
					if (item.name != "chClientsRegistryAdministratorReadOnly" && val === true) item.control.patchValue(true);
					else item.control.patchValue(false);
				});
				break;
			case "Production":
				this.globalArrs.Production.forEach((item: privilegeRole) => {
					if (item.name != "chProductionReadOnly" && val === true) item.control.patchValue(true);
					else item.control.patchValue(false);
				});
				break;
			case "CustomerService":
				this.globalArrs.CustomerService.forEach((item: privilegeRole) => {
					if (item.name != "chCustomerServiceReadOnly" && val === true) item.control.patchValue(true);
					else item.control.patchValue(false);
				});
				break;
			case "ClaimsManagement":
				this.globalArrs.ClaimsManagement.forEach((item: privilegeRole) => {
					if (item.name != "chClaimsManagementSystemReadOnly" && val === true) item.control.patchValue(true);
					else item.control.patchValue(false);
				});
				break;
			case "FinancialManagement":
				let key: keyof typeof this.globalArrs.FinancialManagement;
				for (key in this.globalArrs.FinancialManagement) {
					if (val === true) {
						this.globalArrs.FinancialManagement[key].forEach((e) => e.control.patchValue(true));
						this.ff.chFinance?.patchValue(true);
					} else this.globalArrs.FinancialManagement[key].forEach((e) => e.control.patchValue(false));
				}
				break;
			case "HumanResources":
				let hrKey: keyof typeof this.globalArrs.HumanResources;
				for (hrKey in this.globalArrs.HumanResources) {
					if (val === true) {
						this.globalArrs.HumanResources[hrKey].forEach((e) => e.control.patchValue(true));
						this.ff.chHR?.patchValue(true);
					} else this.globalArrs.HumanResources[hrKey].forEach((e) => e.control.patchValue(false));
				}
				break;
			case "FixedAssets":
				this.globalArrs.FixedAssets.forEach((item: privilegeRole) => {
					if (item.name != "chFixedAssetsReadOnly" && val === true) item.control.patchValue(true);
					else item.control.patchValue(false);
				});
				break;
			case "SysAdmin":
				this.globalArrs.SysAdmin.forEach((item: privilegeRole) => {
					if (val === true) item.control.patchValue(true);
					else item.control.patchValue(false);
				});
				break;
			default:
				console.log("err");
		}
	}

	subItemsChecker(moduleName: string, subMenu: string, val: boolean) {
		let mainChecker: privilegeRole[] = [];
		if (moduleName === "FinancialManagement") {
			this.globalArrs.FinancialManagement[subMenu as keyof typeof this.globalArrs.FinancialManagement].forEach((item, i) => {
				if (val) item.control.patchValue(true);
				else item.control.patchValue(false);
			});
			let key: keyof typeof this.globalArrs.FinancialManagement;
			for (key in this.globalArrs.FinancialManagement) {
				if (subMenu != "generalRoles")
					this.globalArrs.FinancialManagement[key].forEach((e, i) => {
						if (e.control.value === true && i > 0) mainChecker.push(e);
					});
				else
					this.globalArrs.FinancialManagement[key].forEach((e, i) => {
						if (e.control.value === true) mainChecker.push(e);
					});
			}
			if (mainChecker.length > 0) this.ff.chFinance?.patchValue(true);
			else this.ff.chFinance?.patchValue(false);
		} else {
			this.globalArrs.HumanResources[subMenu as keyof typeof this.globalArrs.HumanResources].forEach((item, i) => {
				if (val) item.control.patchValue(true);
				else item.control.patchValue(false);
			});
			let key: keyof typeof this.globalArrs.HumanResources;
			for (key in this.globalArrs.HumanResources) {
				if (subMenu != "generalRoles")
					this.globalArrs.HumanResources[key].forEach((e, i) => {
						if (e.control.value === true && i > 0) mainChecker.push(e);
					});
				else
					this.globalArrs.HumanResources[key].forEach((e, i) => {
						if (e.control.value === true) mainChecker.push(e);
					});
			}
			if (mainChecker.length > 0) this.ff.chHR?.patchValue(true);
			else this.ff.chHR?.patchValue(false);
		}
	}

	checkMasterItem(modulName: string, subMenu?: string, val?: boolean) {
		let checkarr!: privilegeRole[];
		let checker: privilegeRole | undefined;
		switch (modulName) {
			case "MasterTable":
				checkarr = this.globalArrs.MasterTable.filter((e) => !(e.name == "chMasterTabels" || e.name == "chMasterTablesReadOnly"));
				checker = checkarr.find((item: privilegeRole) => item.control.value === true);
				if (checker) this.globalArrs.MasterTable.find((e) => e.name === "chMasterTabels")?.control.patchValue(true);
				else this.globalArrs.MasterTable.find((e) => e.name === "chMasterTabels")?.control.patchValue(false);
				break;
			case "BussinessDevelopment":
				checkarr = this.globalArrs.BussinessDevelopment.filter((e) => !(e.name == "chBussDevelopment" || e.name == "chBusinessDevelopmentReadOnly"));
				checker = checkarr.find((item: privilegeRole) => item.control.value === true);
				if (checker) this.globalArrs.BussinessDevelopment.find((e) => e.name === "chBussDevelopment")?.control.patchValue(true);
				else this.globalArrs.BussinessDevelopment.find((e) => e.name === "chBussDevelopment")?.control.patchValue(false);
				break;
			case "ClientRegistry":
				checkarr = this.globalArrs.ClientRegistry.filter(
					(e) => !(e.name == "chClientsRegistryAdmin" || e.name == "chClientsRegistryAdministratorReadOnly")
				);
				checker = checkarr.find((item: privilegeRole) => item.control.value === true);
				if (checker) this.globalArrs.ClientRegistry.find((e) => e.name === "chClientsRegistryAdmin")?.control.patchValue(true);
				else this.globalArrs.ClientRegistry.find((e) => e.name === "chClientsRegistryAdmin")?.control.patchValue(false);
				break;
			case "Production":
				checkarr = this.globalArrs.Production.filter((e) => !(e.name == "chProduction" || e.name == "chProductionReadOnly"));
				checker = checkarr.find((item: privilegeRole) => item.control.value === true);
				if (checker) this.globalArrs.Production.find((e) => e.name === "chProduction")?.control.patchValue(true);
				else this.globalArrs.Production.find((e) => e.name === "chProduction")?.control.patchValue(false);
				break;
			case "CustomerService":
				checkarr = this.globalArrs.CustomerService.filter((e) => !(e.name == "chCustomerService" || e.name == "chCustomerServiceReadOnly"));
				checker = checkarr.find((item: privilegeRole) => item.control.value === true);
				if (checker) this.globalArrs.CustomerService.find((e) => e.name === "chCustomerService")?.control.patchValue(true);
				else this.globalArrs.CustomerService.find((e) => e.name === "chCustomerService")?.control.patchValue(false);
				break;
			case "ClaimsManagement":
				checkarr = this.globalArrs.ClaimsManagement.filter((e) => !(e.name == "chClaims" || e.name == "chClaimsManagementSystemReadOnly"));
				checker = checkarr.find((item: privilegeRole) => item.control.value === true);
				if (checker) this.globalArrs.ClaimsManagement.find((e) => e.name === "chClaims")?.control.patchValue(true);
				else this.globalArrs.ClaimsManagement.find((e) => e.name === "chClaims")?.control.patchValue(false);
				break;
			case "FinancialManagement":
				let chosenSubMenu = this.globalArrs.FinancialManagement[subMenu as keyof typeof this.globalArrs.FinancialManagement];
				let mainChecker: privilegeRole[] = [];
				if (subMenu != "generalRoles") checkarr = chosenSubMenu.filter((e) => e.name !== chosenSubMenu[0].name);
				else checkarr = chosenSubMenu.filter((e) => e.control.value === true);
				let key: keyof typeof this.globalArrs.FinancialManagement;
				for (key in this.globalArrs.FinancialManagement) {
					if (subMenu != "generalRoles")
						this.globalArrs.FinancialManagement[key].forEach((e, i) => {
							if (e.control.value === true && i > 0) mainChecker.push(e);
						});
					else
						this.globalArrs.FinancialManagement[key].forEach((e, i) => {
							if (e.control.value === true) mainChecker.push(e);
						});
				}
				checker = checkarr.find((item: privilegeRole) => item.control.value === true);
				if (subMenu != "generalRoles") {
					if (checker) {
						chosenSubMenu[0].control.patchValue(true);
						this.ff.chFinance?.patchValue(true);
					} else {
						chosenSubMenu[0].control.patchValue(false);
					}
				} else {
					if (checker) this.ff.chFinance?.patchValue(true);
					else this.ff.chFinance?.patchValue(false);
				}
				if (mainChecker.length > 0) this.ff.chFinance?.patchValue(true);
				else this.ff.chFinance?.patchValue(false);
				break;
			case "HumanResources":
				let cchosenSubMenu = this.globalArrs.HumanResources[subMenu as keyof typeof this.globalArrs.HumanResources];
				let mmainChecker: privilegeRole[] = [];
				if (subMenu != "generalRoles") checkarr = cchosenSubMenu.filter((e) => e.name !== cchosenSubMenu[0].name);
				else checkarr = cchosenSubMenu.filter((e) => e.control.value === true);
				let keyy: keyof typeof this.globalArrs.HumanResources;
				for (keyy in this.globalArrs.HumanResources) {
					if (subMenu != "generalRoles")
						this.globalArrs.HumanResources[keyy].forEach((e, i) => {
							if (e.control.value === true && i > 0) mmainChecker.push(e);
						});
					else
						this.globalArrs.HumanResources[keyy].forEach((e, i) => {
							if (e.control.value === true) mmainChecker.push(e);
						});
				}
				checker = checkarr.find((item: privilegeRole) => item.control.value === true);
				if (subMenu != "generalRoles") {
					if (checker) {
						cchosenSubMenu[0].control.patchValue(true);
						this.ff.chHR?.patchValue(true);
					} else {
						cchosenSubMenu[0].control.patchValue(false);
					}
				} else {
					if (checker) this.ff.chHR?.patchValue(true);
					else this.ff.chHR?.patchValue(false);
				}
				if (mmainChecker.length > 0) this.ff.chHR?.patchValue(true);
				else this.ff.chHR?.patchValue(false);
				break;
			case "FixedAssets":
				checkarr = this.globalArrs.FixedAssets.filter((e) => !(e.name == "chFixedAssets" || e.name == "chFixedAssetsReadOnly"));
				checker = checkarr.find((item: privilegeRole) => item.control.value === true);
				if (checker) this.globalArrs.FixedAssets.find((e) => e.name === "chFixedAssets")?.control.patchValue(true);
				else this.globalArrs.FixedAssets.find((e) => e.name === "chFixedAssets")?.control.patchValue(false);
				break;
			case "SysAdmin":
				checkarr = this.globalArrs.SysAdmin.filter((e) => !(e.name == "chSystemAdmin"));
				checker = checkarr.find((item: privilegeRole) => item.control.value === true);
				if (checker) this.globalArrs.SysAdmin.find((e) => e.name === "chSystemAdmin")?.control.patchValue(true);
				else this.globalArrs.SysAdmin.find((e) => e.name === "chSystemAdmin")?.control.patchValue(false);
				break;
			default:
				console.log("err");
		}
	}

	getAllPrivileges(sno: number) {
		this.eventService.broadcast(reserved.isLoading, true);
		this.resePrivilegesForm();
		let sub = this.systemAdminService.getAllPrivileges(sno).subscribe(
			(res: HttpResponse<IBaseResponse<IUserRolesPrivileges>>) => {
				if (res.body?.status) {
					this.message.toast(res.body!.message!, "success");
					this.uiState.privilagesData = res.body?.data!;
					let key: keyof typeof this.uiState.privilagesData;
					for (key in this.uiState.privilagesData) {
						if (key === "sNo") this.uiState.convertedPrivilagesData[key] = this.uiState.privilagesData[key];
						else if (key === "activePrivileges") this.uiState.convertedPrivilagesData[key] = this.uiState.privilagesData[key];
						else {
							if (this.uiState.privilagesData[key] === 1) this.uiState.convertedPrivilagesData[key] = true;
							else this.uiState.convertedPrivilagesData[key] = false;
						}
					}
					this.privilegesForm.patchValue({
						...this.uiState.convertedPrivilagesData,
					});
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

	submitPrivilegesForm(form: FormGroup) {
		this.eventService.broadcast(reserved.isLoading, true);
		let rawData = form.getRawValue();
		let dataToSubmit: IUserRolesPrivileges | any = {};
		for (let key in rawData) {
			if (key === "sNo") dataToSubmit[key] = rawData[key];
			else if (key === "activePrivileges") dataToSubmit[key] = rawData[key];
			else {
				if (rawData[key] === true) dataToSubmit[key] = 1;
				else dataToSubmit[key] = 0;
			}
		}
		let sub = this.systemAdminService.editAllPrivileges(dataToSubmit).subscribe(
			(res: HttpResponse<IBaseResponse<number>>) => {
				if (res.body?.status) {
					this.message.toast(res.body!.message!, "success");
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

	resePrivilegesForm() {
		this.privilegesForm.reset();
	}

	//#endregion

	ngOnInit(): void {
		this.initRoleForm();
		this.initPrivilegesForm();
	}
}
