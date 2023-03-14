import { BaseData } from "src/app/core/models/masterTableModels";
const LookUpTables = "/LookupTables/";

export const ApiRoutes = {
  Users: {
    login: "/Account/login",
    refesh: "/Account/RefreshToken",
  },
  MasterTable: {
    MasterTables: {
      insurClasses: LookUpTables + BaseData.InsurClasses,
      lineOfBusiness: LookUpTables + BaseData.LineOfBusiness,
      insuranceComapnies: LookUpTables + BaseData.InsuranceCompanies,
      contactLineOfBusiness: LookUpTables + BaseData.ContactLineOfBusiness,
      contactDepartment: LookUpTables + BaseData.ContactDepartment,
      TypeOfCustomerServices: LookUpTables + BaseData.TypeOfCustomerServices,
      policyEndorsTypes: LookUpTables + BaseData.PolicyEndorsTypes,
      regions: LookUpTables + BaseData.Regions,
      cities: LookUpTables + BaseData.Cities,
      claimStatus: LookUpTables + BaseData.ClaimStatus,
      TypeClaimsRejectionReason:
        LookUpTables + BaseData.TypeClaimsRejectionReason,
      vehicleCarsMake: LookUpTables + BaseData.VehicleCarsMake,
    },
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
      prospectsReportsTypes: LookUpTables + BaseData.ProspectsReportsTypes,
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
      insurClasses: LookUpTables + BaseData.InsurClasses,
      currencies: LookUpTables + BaseData.Currencies,
      banks: LookUpTables + BaseData.Banks,
      rejectionReasons: LookUpTables + BaseData.RejectionReasons,
      claimCaseTypes: LookUpTables + BaseData.ClaimCaseTypes,
      motorClaimTypes: LookUpTables + BaseData.MotorClaimTypes,
      typesOfRepair: LookUpTables + BaseData.TypesOfRepair,
      hospitals: LookUpTables + BaseData.Hospitals,
      carsModels: LookUpTables + BaseData.CarsModels,
      cities: LookUpTables + BaseData.Cities,
    },
    SystemAdmin: {
      statusOfUsers: LookUpTables + BaseData.StatusOfUsers,
      jobTitleOfUsers: LookUpTables + BaseData.JobTitleOfUsers,
      branch: LookUpTables + BaseData.Branch,
      staffProfilesNames: LookUpTables + BaseData.ProducersList,
      userSecurityRoles: LookUpTables + BaseData.UserSecurityRoles,
    },
    Reports: {
      clientsList: LookUpTables + BaseData.ClientsList,
      groupsList: LookUpTables + BaseData.GroupsList,
      InsurClasses: LookUpTables + BaseData.InsurClasses,
      lineOfBusinessByClassNames: LookUpTables + "LineOfBusinessByClassNames",
      insuranceCompanies: LookUpTables + BaseData.InsuranceCompanies,
      branch: LookUpTables + BaseData.Branch,
      producers: LookUpTables + BaseData.Producers,
      policyEndorsTypes: LookUpTables + BaseData.PolicyEndorsTypes,
      productionReportType: LookUpTables + BaseData.ProductionReportType,
      productionReportBasedOn: LookUpTables + BaseData.ProductionReportBasedOn,
      productionReportCaptive: LookUpTables + BaseData.ProductionReportCaptive,
      productionReportStatus: LookUpTables + BaseData.ProductionReportStatus,
      renewalNoticeReportStatus:
        LookUpTables + BaseData.RenewalNoticeReportStatus,
      cserviceStatus: LookUpTables + BaseData.CServiceStatus,
      csReportType: LookUpTables + BaseData.CSReportType,
      allUsers: LookUpTables + BaseData.AllUsers,
      csReportStatus: LookUpTables + BaseData.CSReportStatus,
      claimsReportType: LookUpTables + BaseData.ClaimsReportType,
    },
  },
  MasterMethods: {
    downloadDocument: "/Documents/Download",
    deleteDocument: "/Documents/Delete",
    lineOfBusiness: LookUpTables + "LineOfBusiness",
  },
  masterTables: {
    inuranceClasses: {
      search: "/MasterTables/InsurranceClass/Search",
      save: "/MasterTables/InsurranceClass/Save",
      edit: "/MasterTables/InsurranceClass/Edit",
      delete: "/MasterTables/InsurranceClass/Delete",
    },
    lineOfBusiness: {
      search: "/MasterTables/LineOfBusiness/Search",
      save: "/MasterTables/LineOfBusiness/Save",
      edit: "/MasterTables/LineOfBusiness/Edit",
      delete: "/MasterTables/LineOfBusiness/Delete",
    },
    insuranceCompanies: {
      search: "/MasterTables/InsuranceCompanies/Search",
      save: "/MasterTables/InsuranceCompanies/Save",
      edit: "/MasterTables/InsuranceCompanies/Edit",
      delete: "/MasterTables/InsuranceCompanies/Delete",
    },
    insuranceBrokers: {
      search: "/MasterTables/InsuranceBrokers/Search",
      save: "/MasterTables/InsuranceBrokers/Save",
      edit: "/MasterTables/InsuranceBrokers/Edit",
      delete: "/MasterTables/InsuranceBrokers/Delete",
    },
    policyTypes: {
      search: "/MasterTables/PolicyTypes/Search",
      create: "/MasterTables/PolicyTypes/Create",
      edit: "/MasterTables/PolicyTypes/Edit",
      delete: "/MasterTables/PolicyTypes/Delete",
    },
    nationalities: {
      search: "/MasterTables/Nationalities/Search",
      save: "/MasterTables/Nationalities/Save",
      edit: "/MasterTables/Nationalities/Edit",
      delete: "/MasterTables/Nationalities/Delete",
    },
    businessActivity: {
      search: "/MasterTables/BusinessActivity/Search",
      save: "/MasterTables/BusinessActivity/Save",
      edit: "/MasterTables/BusinessActivity/Edit",
      delete: "/MasterTables/BusinessActivity/Delete",
    },
    legalStatus: {
      search: "/MasterTables/LegalStatus/Search",
      save: "/MasterTables/LegalStatus/Save",
      edit: "/MasterTables/LegalStatus/Edit",
      delete: "/MasterTables/LegalStatus/Delete",
    },
    locations: {
      search: "/MasterTables/Locations/Search",
      save: "/MasterTables/Locations/Save",
      edit: "/MasterTables/Locations/Edit",
      delete: "/MasterTables/Locations/Delete",
    },
    BusinessDevelopment: {
      Sales: {
        QuotingRequirements: {
          search: "/MasterTables/SalesQuotingRequirements/Search",
          save: "/MasterTables/SalesQuotingRequirements/Save",
          edit: "/MasterTables/SalesQuotingRequirements/Edit",
          delete: "/MasterTables/SalesQuotingRequirements/Delete",
        },
        PolicyIssuanceRequirements: {
          search: "/MasterTables/SalesPolicyRequirements/Search",
          save: "/MasterTables/SalesPolicyRequirements/Save",
          edit: "/MasterTables/SalesPolicyRequirements/Edit",
          delete: "/MasterTables/SalesPolicyRequirements/Delete",
        },
        ProspectsLossReasons: {
          search: "/MasterTables/ProspectsLossReasons/Search",
          save: "/MasterTables/ProspectsLossReasons/Save",
          edit: "/MasterTables/ProspectsLossReasons/Edit",
          delete: "/MasterTables/ProspectsLossReasons/Delete",
        },
      },
      CancellationRejectionReasons: {
        CompanyRejectionReason: {
          search: "/MasterTables/CompanyRejectionReason/Search",
          save: "/MasterTables/CompanyRejectionReason/Save",
          edit: "/MasterTables/CompanyRejectionReason/Edit",
          delete: "/MasterTables/CompanyRejectionReason/Delete",
        },
        ClientRejectionReason: {
          search: "/MasterTables/ClientRejectionReason/Search",
          save: "/MasterTables/ClientRejectionReason/Save",
          edit: "/MasterTables/ClientRejectionReason/Edit",
          delete: "/MasterTables/ClientRejectionReason/Delete",
        },
        CancellationReason: {
          search: "/MasterTables/CancellationReason/Search",
          save: "/MasterTables/CancellationReason/Save",
          edit: "/MasterTables/CancellationReason/Edit",
          delete: "/MasterTables/CancellationReason/Delete",
        },
      },
    },
    clientCategories: {
      search: "/MasterTables/ClientsCategory/Search",
      save: "/MasterTables/ClientsCategory/Save",
      edit: "/MasterTables/ClientsCategory/Edit",
      delete: "/MasterTables/ClientsCategory/Delete",
    },
    customerService: {
      InsuranceCompaniesDocuments: {
        search: "/MasterTables/CustomerService/CompanyDocuments/Search",
        upload: "/MasterTables/CustomerService/CompanyDocuments/Upload",
      },
      customerServiceRequirements: {
        search: "/MasterTables/CustomerService/CompanyRequirments/Search",
        save: "/MasterTables/CustomerService/CompanyRequirments/Save",
        delete: "/MasterTables/CustomerService/CompanyRequirments/Delete",
      },
      complaintsTypes: {
        search: "/MasterTables/CustomerService/ComplaintsTypes/Index",
        save: "/MasterTables/CustomerService/ComplaintsTypes/Save",
        edit: "/MasterTables/CustomerService/ComplaintsTypes/Edit",
        delete: "/MasterTables/CustomerService/ComplaintsTypes/Delete",
      },
      complaintsSettings: {
        search: "/MasterTables/CustomerService/ComplaintsSettings/Index",
        save: "/MasterTables/CustomerService/ComplaintsSettings/Edit",
      },
      complaintsSuspectiveCauses: {
        search: "/MasterTables/CustomerService/SuspectiveCauses/Index",
        save: "/MasterTables/CustomerService/SuspectiveCauses/Save",
        edit: "/MasterTables/CustomerService/SuspectiveCauses/Edit",
        delete: "/MasterTables/CustomerService/SuspectiveCauses/Delete",
      },
      customerServiceCancellationReasons: {
        search: "/MasterTables/CustomerService/CancellationReasons/Index",
        save: "/MasterTables/CustomerService/CancellationReasons/Save",
        edit: "/MasterTables/CustomerService/CancellationReasons/Edit",
        delete: "/MasterTables/CustomerService/CancellationReasonsDelete",
      },
    },
    Claims: {
      carsMake: {
        search: "/MasterTables/Claims/CarsMake/Index",
        save: "/MasterTables/Claims/CarsMake/Save",
        edit: "/MasterTables/Claims/CarsMake/Edit",
        delete: "/MasterTables/Claims/CarsMake/Delete",
      },
      hospitals: {
        search: "/MasterTables/Claims/Hospital/Index",
        save: "/MasterTables/Claims/Hospital/Save",
        edit: "/MasterTables/Claims/Hospital/Edit",
        delete: "/MasterTables/Claims/Hospital/Delete",
      },
      insuranceWorkshopDetails: {
        search: "/MasterTables/Claims/WorkshopDetails/Search",
        save: "/MasterTables/Claims/WorkshopDetails/Save",
        edit: "/MasterTables/Claims/WorkshopDetails/Edit",
        delete: "/MasterTables/Claims/WorkshopDetails/Delete",
      },
      tpaList: {
        search: "/MasterTables/Claims/TPAList/Index",
        save: "/MasterTables/Claims/TPAList/Save",
        delete: "/MasterTables/Claims/TPAList/Delete",
      },
      claimsGeneralItems: {
        search: "/MasterTables/Claims/GeneralItems/Search",
        save: "/MasterTables/Claims/GeneralItems/Save",
        edit: "/MasterTables/Claims/GeneralItems/Edit",
        delete: "/MasterTables/Claims/GeneralItems/Delete",
      },
      claimsStatus: {
        search: "/MasterTables/Claims/Status/Search",
        save: "/MasterTables/Claims/Status/Save",
        edit: "/MasterTables/Claims/Status/Edit",
        delete: "/MasterTables/Claims/Status/Delete",
      },
      claimsRejectionReasons: {
        search: "/MasterTables/Claims/RejectionReasons/Search",
        save: "/MasterTables/Claims/RejectionReasons/Save",
        edit: "/MasterTables/Claims/RejectionReasons/Edit",
        delete: "/MasterTables/Claims/RejectionReasons/Delete",
      },
    },
    vehiclesTypes: {
      search: "/MasterTables/VehiclesTypes/Search",
      save: "/MasterTables/VehiclesTypes/Save",
      edit: "/MasterTables/VehiclesTypes/Edit",
      delete: "/MasterTables/VehiclesTypes/Delete",
    },
    contactsListPosition: {
      search: "/MasterTables/Position/Search",
      save: "/MasterTables/Position/Save",
      edit: "/MasterTables/Position/Edit",
      delete: "/MasterTables/Position/Delete",
    },
    cities: {
      search: "/MasterTables/Cities/Search",
      save: "/MasterTables/Cities/Save",
      edit: "/MasterTables/Cities/Edit",
      delete: "/MasterTables/Cities/Delete",
    },
    defaultEmail: {
      search: "/MasterTables/DefaultEmail/Search",
      save: "/MasterTables/DefaultEmail/Save",
      edit: "/MasterTables/DefaultEmail/Edit",
    },
    bankSettings: {
      search: "/MasterTables/BanksSettings/Search",
      save: "/MasterTables/BanksSettings/Save",
      edit: "/MasterTables/BanksSettings/Edit",
      delete: "/MasterTables/BanksSettings/Delete",
    },
    production: {
      libraryOfCovers: {
        search: "/MasterTables/LibraryofCovers/Search",
        save: "/MasterTables/LibraryofCovers/Save",
        edit: "/MasterTables/LibraryofCovers/Edit",
        delete: "/MasterTables/LibraryofCovers/Delete",
      },
      libraryOfInterestsInsured: {
        search: "/MasterTables/InterestsInsuredLibrary/Search",
        save: "/MasterTables/InterestsInsuredLibrary/Save",
        edit: "/MasterTables/InterestsInsuredLibrary/Edit",
        delete: "/MasterTables/InterestsInsuredLibrary/Delete",
      },
      libraryOfTermsAndConditions: {
        search: "/MasterTables/TermsAndConditions/Search",
        save: "/MasterTables/TermsAndConditions/Save",
        edit: "/MasterTables/TermsAndConditions/Edit",
        delete: "/MasterTables/TermsAndConditions/Delete",
      },
      libraryOfDeductibles: {
        search: "/MasterTables/Deductibles/Search",
        save: "/MasterTables/Deductibles/Save",
        edit: "/MasterTables/Deductibles/Edit",
        delete: "/MasterTables/Deductibles/Delete",
      },
      libraryOfExclusions: {
        search: "/MasterTables/Exclusions/Search",
        save: "/MasterTables/Exclusions/Save",
        edit: "/MasterTables/Exclusions/Edit",
        delete: "/MasterTables/Exclusions/Delete",
      },
      libraryOfWarranties: {
        search: "/MasterTables/Warranties/Search",
        save: "/MasterTables/Warranties/Save",
        edit: "/MasterTables/Warranties/Edit",
        delete: "/MasterTables/Warranties/Delete",
      },
      lifePlan: {
        search: "/MasterTables/LifePlan/Search",
        save: "/MasterTables/LifePlan/Save",
        edit: "/MasterTables/LifePlan/Edit",
        delete: "/MasterTables/LifePlan/Delete",
      },
      vehicleMake: {
        search: "/MasterTables/VehicleCarMake/Search",
        save: "/MasterTables/VehicleCarMake/Save",
        edit: "/MasterTables/VehicleCarMake/Edit",
        delete: "/MasterTables/VehicleCarMake/Delete",
      },
      vehicleType: {
        search: "/MasterTables/VehicleTypes/Search",
        save: "/MasterTables/VehicleTypes/Save",
        edit: "/MasterTables/VehicleTypes/Edit",
        delete: "/MasterTables/VehicleTypes/Delete",
      },
      vehicleColor: {
        search: "/MasterTables/VehicleColors/Search",
        save: "/MasterTables/VehicleColors/Save",
        edit: "/MasterTables/VehicleColors/Edit",
        delete: "/MasterTables/VehicleColors/Delete",
      },
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
    prospectReport: "/BusinessDevelopment/SalesLeads/ProspectsReport",
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
    editCommissions: "/Production/Policy/SearchClientPoliciesFilter",
    editEditCommission: "/Production/Policy/EditPolicyCommission",
    updatePolicyCommission: "/Production/Policy/UpdatePolicyComissions",
    productionReport: "/Production/Policy/StatisticsReport",
    renewalReport: "/Production/Policy/RenewalsReports",
    renewalNoticeReports: "/Production/Policy/RenewalNoticeReports",
    archiveReport: "/Production/Policy/ArchivesReports",
    debitcreditNoteReport: "/Production/Policy/GenerateArchivesReportsURL",
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
    csReport: "/CustomerService/Requests/Reports",
    summary: "/CustomerService/Requests/Summary",
    delete: "",
  },
  Claims: {
    search: "/Claims/Search",
    saveClaim: "/Claims/SaveClaim",
    editClaim: "/Claims/EditClaim",
    saveClaimPayment: "/Claims/SaveClaimPayment",
    approvePayment: "/Claims/Approve",
    rejectPayment: "/Claims/Reject",
    saveClaimApproval: "/Claims/SaveClaimApproval",
    saveClaimInvoice: "/Claims/SaveClaimInvoice",
    saveClaimRejectDeduct: "/Claims/SaveClaimsRejections",
    deleteClaimRejectDeduct: "/Claims/DeleteClaimsRejections",
    searchPolicy: "/Claims/SearchPolicy",
    SearchClientClaimData: "/Claims/SearchClientClaimData",
    subStatus: "/Claims/GetSubStatusByStatus",
    followUps: "/Claims/GetClaimFollowUps",
    saveFollowUps: "/Claims/SaveClaimFollowUp",
    getClaimStatusNotes: "/Claims/GetClaimStatusNotes",
    getInsurerWorkshops: "/Claims/GetInsurerWorkshops",
    getClientMailData: "/Claims/NotifyClientMailData",
    getInsurerMailData: "/Claims/NotifyInsurerMailData",
    claimsReport: "/Claims/Reports",
    archiveReport: "/Claims/ArchiveReport",
    summary: "/Claims/Summary",
  },
  LookUpTables: {
    allActiveClients: "/LookupTables/AllClientbyStatus",
  },
  SystemAdmin: {
    search: "/SystemAdmin/Users/Search",
    allRoles: "/SystemAdmin/Users/GetRoles",
    changeStatus: "/SystemAdmin/Users/ChangeStatus",
    userDetails: "/SystemAdmin/Users/ProducerBySno",
    addRole: "/SystemAdmin/Users/AddRole",
    deleteRole: "/SystemAdmin/Users/DeleteRole",
    getPrivileges: "/SystemAdmin/Users/GetPrivileges",
    editPrivileges: "/SystemAdmin/Users/EditPrivileges",
    changePasswordAsync: "/SystemAdmin/Users/ChangePasswordAsync",
    save: "/SystemAdmin/Users/Save",
    edit: "/SystemAdmin/Users/Edit",
    privigles: "/SystemAdmin/Users/ActivePrivileges",
  },
};
