import { BaseData } from "src/app/core/models/masterTableModels";
const LookUpTables = "/LookupTables/";

export const ApiRoutes = {
	Users: {
		login: "/Account/login",
	},
	MasterTable: {
		Client: {
			clientType: LookUpTables + BaseData.ClientType,
			producers: LookUpTables + BaseData.Producers,
			relationshipStatus: LookUpTables + BaseData.RelationshipStatus,
			businessType: LookUpTables + BaseData.BusinessType,
			channels: LookUpTables + BaseData.Channels,
			interface: LookUpTables + BaseData.Interface,
			screeningResult: LookUpTables + BaseData.ScreeningResult,
			nationalities: LookUpTables + BaseData.Nationalities,
			sourceofIncome: LookUpTables + BaseData.SourceofIncome,
			registrationStatus: LookUpTables + BaseData.RegistrationStatus,
			businessActivities: LookUpTables + BaseData.BusinessActivities,
			marketSegment: LookUpTables + BaseData.MarketSegment,
			premium: LookUpTables + BaseData.Premium,
			positions: LookUpTables + BaseData.Positions,
			branch: LookUpTables + BaseData.Branch,
			contactDepartment: LookUpTables + BaseData.ContactDepartment,
			contactLineOfBusiness: LookUpTables + BaseData.ContactLineOfBusiness,
			banks: LookUpTables + BaseData.Banks,
			lineOfBusiness: LookUpTables + BaseData.LineOfBusiness,
			commericalNo: LookUpTables + BaseData.CommericalNo,
			groupsList: LookUpTables + BaseData.GroupsList,
			status: LookUpTables + BaseData.ClientStatus,
		},
		BusinessDevelopment: {
			groupsList: LookUpTables + BaseData.GroupsList,
			branch: LookUpTables + BaseData.Branch,
			producers: LookUpTables + BaseData.Producers,
			InsurClasses: LookUpTables + BaseData.InsurClasses,
			AllUsers: LookUpTables + BaseData.AllUsers,
			SalesleadStatus: LookUpTables + BaseData.SalesleadStatus,
			allClients: LookUpTables + BaseData.AllClients,
			insurClasses: LookUpTables + BaseData.InsurClasses,
			InsuranceCompanyName: LookUpTables + BaseData.InsuranceCompanyName,
			InsuranceBrokersList: LookUpTables + BaseData.InsuranceBrokersList,
			logType: LookUpTables + BaseData.LogType,
		},
		CustomerService: {
			AllClients: LookUpTables + BaseData.AllClients,
			Branch: LookUpTables + BaseData.Branch,
			InsuranceCompanies: LookUpTables + BaseData.InsuranceCompanies,
			CServiceStatus: LookUpTables + BaseData.CServiceStatus,
			PendingReason: LookUpTables + BaseData.PendingReason,
			AllUsers: LookUpTables + BaseData.AllUsers,
			InsurClasses: LookUpTables + BaseData.InsurClasses,
			TypeOfCustomerServices: LookUpTables + BaseData.TypeOfCustomerServices,
		},
		CustomerServiceForm: {
			policyEndorsTypes: LookUpTables + BaseData.PolicyEndorsTypes,
			allClients: LookUpTables + BaseData.AllClients,
			insuranceCompanies: LookUpTables + BaseData.InsuranceCompanies,
			vatPercentage: LookUpTables + BaseData.VATPercentage,
			branch: LookUpTables + BaseData.Branch,
			PendingReason: LookUpTables + BaseData.PendingReason,
		},
		Production: {
			policyStatus: LookUpTables + BaseData.PolicyStatus,
			branch: LookUpTables + BaseData.Branch,
			policyEndorsTypes: LookUpTables + BaseData.PolicyEndorsTypes,
			clientsList: LookUpTables + BaseData.ClientsList,
			producers: LookUpTables + BaseData.Producers,
			insuranceCompanies: LookUpTables + BaseData.InsuranceCompanies,
			insurClasses: LookUpTables + BaseData.InsurClasses,
			allUsers: LookUpTables + BaseData.AllUsers,
			insuranceClasses: LookUpTables + BaseData.InsurClasses,
			endorsTypes: LookUpTables + BaseData.PolicyEndorsTypes,
			productionFieldList: LookUpTables + BaseData.ProductionFieldList,
			productionOperatordList: LookUpTables + BaseData.ProductionOperatordList,
		},
		Claims: {
			claimStatus: LookUpTables + BaseData.ClaimStatus,
			allUsers: LookUpTables + BaseData.AllUsers,
			typeOfCustomerServices: LookUpTables + BaseData.TypeOfCustomerServices,
			insuranceCompanies: LookUpTables + BaseData.InsuranceCompanies,
			productionOperatordList: LookUpTables + BaseData.ProductionOperatordList,
		},
		SystemAdmin: {
			statusOfUsers: LookUpTables + BaseData.StatusOfUsers,
			jobTitleOfUsers: LookUpTables + BaseData.JobTitleOfUsers,
			branch: LookUpTables + BaseData.Branch,
		},
	},
	MasterMethods: {
		downloadDocument: "/Documents/Download",
		deleteDocument: "/Documents/Delete",
		lineOfBusiness: LookUpTables + "LineOfBusiness",
	},
	Clients: {
		search: "/ClientRegistry/Clients/Search",
		details: "/ClientRegistry/Clients/Details",
		save: "/ClientRegistry/Clients/Save",
		edit: "/ClientRegistry/Clients/Edit",
		changeStatus: "/ClientRegistry/Clients/ChangeStatus",
		deleteDocument: "/ClientRegistry/Clients/DeleteFile",
		downloadDocument: "/ClientRegistry/Clients/DownloadFile",
		report: "/ClientRegistry/Clients/Report",
	},
	ClientsGroups: {
		list: "/ClientRegistry/Groups/Search",
		create: "/ClientRegistry/Groups/Create",
		delete: "/ClientRegistry/Groups/Delete",
		listGroupClients: "/ClientRegistry/Groups/AllClients",
		addClient: "/ClientRegistry/Groups/Join",
		deleteClient: "/ClientRegistry/Groups/RemoveClient",
	},
	BusinessDevelopment: {
		search: "/BusinessDevelopment/SalesLeads/Search",
		changeStatus: "/BusinessDevelopment/SalesLeads/UpdateStatus",
		followUp: "/BusinessDevelopment/SalesLeads/GetSalesLeadFllowup",
		saveNote: "/BusinessDevelopment/SalesLeads/SaveNote",
		quotingRequirements: "/BusinessDevelopment/SalesLeads/QuotingRequirments",
		lineOfBusiness: "/LookupTables/LineOfBusiness",
		policyRequirements: "/BusinessDevelopment/SalesLeads/PolicyRequirments",
		save: "/BusinessDevelopment/SalesLeads/Save",
		edit: "/BusinessDevelopment/SalesLeads/Edit",
	},
	Production: {
		search: "/Production/Policy/Search",
		details: "/Production/Policy/Details",
		clientByRequest: "/Production/Policy/SearchClientByRequest",
		searchClient: LookUpTables + "ActiveClient",
		searchPolicies: "/Production/Policy/SearchClientPolicies",
		fillRequestData: "/Production/Policy/FillRequestData",
		loadPolicyData: "/Production/Policy/LoadPolicyData",
		lineOfBusiness: "/LookupTables/LineOfBusiness",
		save: "/Production/Policy/Save",
		edit: "/Production/Policy/Edit",
		checkEndorsNo: "/Production/Policy/CheckPolicyEnrodsNo",
		changeStatus: "/Production/Policy/ChangeStatus",
	},
	CustomerService: {
		search: "/CustomerService/Requests/Search",
		followUp: "/CustomerService/Requests/CSFollwUp",
		saveNote: "/CustomerService/Requests/SaveNote",
		changeStatus: "/CustomerService/Requests/CSchangeStatus",
		statusCount: "/CustomerService/Requests/StatusCount",
		searchPolicies: "/CustomerService/Requests/PolicesSearch",
		endorseTypeByPolicy: "/CustomerService/Requests/GetEndorseTypeByPolicy",
		csRequirments: "/CustomerService/Requests/CSRequirements",
		create: "/CustomerService/Requests/Save",
		edit: "/CustomerService/Requests/Edit",
		delete: "",
	},
	Claims: {
		search: "/Claims/Search",
		searchPolicy: "/Claims/SearchPolicy",
		SearchClientClaimData: "/Claims/SearchClientClaimData",
		subStatus: "/Claims/GetSubStatusByStatus/Claims/Search",
	},
	LookUpTables: {
		allActiveClients: "/LookupTables/AllClientbyStatus",
	},
	SystemAdmin: {
		search: "/SystemAdmin/Users/Search",
		details: "/SystemAdmin/Users/Details",
		changeStatus: "/SystemAdmin/Users/ChangeStatus",
		addRole: "/SystemAdmin/Users/AddRole",
		deleteRole: "/SystemAdmin/Users/DeleteRole",
		getPrivileges: "/SystemAdmin/Users/GetPrivileges",
		editPrivileges: "/SystemAdmin/Users/EditPrivileges",
		changePasswordAsync: "/SystemAdmin/Users/ChangePasswordAsync",
		save: "/SystemAdmin/Users/Save",
		edit: "/SystemAdmin/Users/Edit",
	},
};
