import { BaseData } from "src/app/core/models/masterTableModels";
const LoolUpTables = "/LookupTables/";

export const ApiRoutes = {
  Users: {
    login: "/Account/login",
  },
  MasterTable: {
    Client: {
      clientType: LoolUpTables + BaseData.ClientType,
      producers: LoolUpTables + BaseData.Producers,
      relationshipStatus: LoolUpTables + BaseData.RelationshipStatus,
      businessType: LoolUpTables + BaseData.BusinessType,
      channels: LoolUpTables + BaseData.Channels,
      interface: LoolUpTables + BaseData.Interface,
      screeningResult: LoolUpTables + BaseData.ScreeningResult,
      nationalities: LoolUpTables + BaseData.Nationalities,
      sourceofIncome: LoolUpTables + BaseData.SourceofIncome,
      registrationStatus: LoolUpTables + BaseData.RegistrationStatus,
      businessActivities: LoolUpTables + BaseData.BusinessActivities,
      marketSegment: LoolUpTables + BaseData.MarketSegment,
      premium: LoolUpTables + BaseData.Premium,
      positions: LoolUpTables + BaseData.Positions,
      branch: LoolUpTables + BaseData.Branch,
      contactDepartment: LoolUpTables + BaseData.ContactDepartment,
      contactLineOfBusiness: LoolUpTables + BaseData.ContactLineOfBusiness,
      banks: LoolUpTables + BaseData.Banks,
      lineOfBusiness: LoolUpTables + BaseData.LineOfBusiness,
      commericalNo: LoolUpTables + BaseData.CommericalNo,
    },
  },
  Clients: {
    search: "/ClientRegistry/Clients/Search",
    details: "/ClientRegistry/Clients/Details",
    editClient: "/ClientRegistry/Clients/Edit",
  },
  ClientsGroups: {
    list: "/ClientRegistry/Groups/Search",
    create: "/ClientRegistry/Groups/Create",
    delete: "/ClientRegistry/Groups/Delete",
    listGroupClients: "/ClientRegistry/Groups/AllClients",
    addGroupClient: "/ClientRegistry/Groups/Join",
    deleteGroupClient: "/ClientRegistry/Groups/RemoveClient",
  },
};
