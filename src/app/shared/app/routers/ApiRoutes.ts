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
		},
	},
	Clients: {
		search: "/ClientRegistry/Clients/Search",
		details: "/ClientRegistry/Clients/Details",
		save: "/ClientRegistry/Clients/Save",
		edit: "/ClientRegistry/Clients/Edit",
		changeStatus: "/ClientRegistry/Clients/ChangeStatus",
		deleteDocument: "/ClientRegistry/Clients/DeleteFile",
		downloadDocument: "/ClientRegistry/Clients/DownloadFile",
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
	},
	CustomerService: {
		search: "",
		create: "",
		edit: "",
		delete: "",
	},
	LookUpTables: {
		allActiveClients: "/LookupTables/AllClientbyStatus",
	},
};
