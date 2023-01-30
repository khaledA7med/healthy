import { Base } from "lord-icon-element/build/triggers/base";
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
    },
  },
  Clients: {
    search: "/ClientRegistry/Clients/Search",
    details: "/ClientRegistry/Clients/Details",
    save: "/ClientRegistry/Clients/Save",
    edit: "/ClientRegistry/Clients/Edit",
    changeStatus: "/ClientRegistry/Clients/ChangeStatus",
  },
  ClientsGroups: {
    list: "/ClientRegistry/Groups/Search",
    create: "/ClientRegistry/Groups/Create",
    delete: "/ClientRegistry/Groups/Delete",
    listGroupClients: "/ClientRegistry/Groups/AllClients",
    addClient: "/ClientRegistry/Groups/Join",
    deleteClient: "/ClientRegistry/Groups/RemoveClient",
  },
  LookUpTables: {
    allActiveClients: "/LookupTables/AllClientbyStatus",
  },
};
