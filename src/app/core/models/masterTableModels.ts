export enum BaseData {
  ClientType = "ClientTypes",
  Producers = "Producers",
  RelationshipStatus = "RelationshipStatus",
  BusinessType = "BusinessType",
  Channels = "Channels",
  Interface = "Interface",
  ScreeningResult = "ScreeningResult",
  Nationalities = "Nationalities",
  SourceofIncome = "SourceofIncome",
  RegistrationStatus = "RegistrationStatus",
  BusinessActivities = "BusinessActivities",
  MarketSegment = "MarketSegment",
  Premium = "Premium",
  Positions = "Positions",
  Branch = "Branch",
  LineOfBusiness = "LineOfBusiness",
  ContactLineOfBusiness = "ContactLineOfBusiness",
  ContactDepartment = "ContactDepartment",
  Banks = "Banks",
  CommericalNo = "CommericalNo",
  GroupsList = "GroupsList",
  ClientStatus = "ClientStatus",
  InsurClasses = "InsurClasses",
  AllUsers = "AllUsers",
  SalesleadStatus = "SalesleadStatus",
  PolicyStatus = "PolicyStatus",
  PolicyEndorsTypes = "PolicyEndorsTypes",
  ClientsList = "ClientsList",
  InsuranceCompanies = "InsuranceCompanies",
  CServiceStatus = "CServiceStatus",
  PendingReason = "PendingReason",
  TypeOfCustomerServices = "TypeOfCustomerServices",
  AllClients = "AllClients",
  InsuranceCompanyName = "InsuranceCompanyName",
  InsuranceBrokersList = "InsuranceBrokersList",
  LogType = "LogType",
  ProductionFieldList = "ProductionFieldList",
  ProductionOperatordList = "ProductionOperatordList",
  VATPercentage = "VATPercentage",
  ClaimStatus = "ClaimStatus",
  JobTitleOfUsers = "JobTitleOfUsers",
  StatusOfUsers = "StatusOfUsers",
  ProducersList = "ProducersList",
  UserSecurityRoles = "UserSecurityRoles",
  Currencies = "Currencies",
  RejectionReasons = "RejectionReasons",
  ProspectsReportsTypes = "ProspectsReportsTypes",
  ClaimCaseTypes = "ClaimCaseTypes",
  MotorClaimTypes = "MotorClaimTypes",
  TypesOfRepair = "TypesOfRepair",
  Hospitals = "Hospitals",
  CarsModels = "CarsModels",
  Cities = "Cities",
  ProductionReportType = "ProductionReportType",
  ProductionReportBasedOn = "ProductionReportBasedOn",
  ProductionReportCaptive = "ProductionReportCaptive",
  ProductionReportStatus = "ProductionReportStatus",
  RenewalNoticeReportStatus = "RenewalNoticeReportStatus",
  CSReportType = "CSReportType",
  CSReportStatus = "CSReportStatus",
  ClaimsReportType = "ClaimsReportType",
  VehicleCarsMake = "VehicleCarsMake",
  Regions = "Regions",
  TypeClaimsRejectionReason = "TypeClaimsRejectionReason",
  GetPolicyTypeIssue = "GetPolicyTypeIssue",
  CategoryOfDefaultEmail = "CategoryOfDefaultEmail",
  TasksTypes = "TasksTypes",
  IBSModules = "IBSModules",
}

export interface IBaseMasterTable {
  ClientTypes?: Caching<IGenericResponseType[]>;
  Producers?: Caching<IGenericResponseType[]>;
  RelationshipStatus?: Caching<IGenericResponseType[]>;
  BusinessType?: Caching<IGenericResponseType[]>;
  Channels?: Caching<IGenericResponseType[]>;
  Interface?: Caching<IGenericResponseType[]>;
  ScreeningResult?: Caching<IGenericResponseType[]>;
  Nationalities?: Caching<INationality[]>;
  SourceofIncome?: Caching<IGenericResponseType[]>;
  RegistrationStatus?: Caching<IGenericResponseType[]>;
  BusinessActivities?: Caching<IBusinessActivity[]>;
  MarketSegment?: Caching<IGenericResponseType[]>;
  Premium?: Caching<IGenericResponseType[]>;
  Positions?: Caching<IPositions[]>;
  Branch?: Caching<IGenericResponseType[]>;
  ContactLineOfBusiness?: Caching<IGenericResponseType[]>;
  ContactDepartment?: Caching<IGenericResponseType[]>;
  Banks?: Caching<IBanks[]>;
  CommericalNo?: Caching<IGenericResponseType[]>;
  GroupsList?: Caching<IGenericResponseType[]>;
  ClientStatus?: Caching<IGenericResponseType[]>;
  CSRegistryClients?: Caching<IGenericResponseType[]>;
  CServiceStatus?: Caching<IGenericResponseType[]>;
  PendingReason?: Caching<IGenericResponseType[]>;
  AllUsers?: Caching<IGenericResponseType[]>;
  TypeOfCustomerServices?: Caching<IGenericResponseType[]>;
  SalesleadStatus?: Caching<IGenericResponseType[]>;
  PolicyEndorsTypes?: Caching<IGenericResponseType[]>;
  ClientsList?: Caching<IGenericResponseType[]>;
  InsuranceCompanies?: Caching<IGenericResponseType[]>;
  PolicyStatus?: Caching<IGenericResponseType[]>;
  AllClients?: Caching<IGenericResponseType[]>;
  InsurClasses?: Caching<IGenericResponseType[]>;
  InsuranceCompanyName?: Caching<IGenericResponseType[]>;
  InsuranceBrokersList?: Caching<IGenericResponseType[]>;
  LogType?: Caching<IGenericResponseType[]>;
  ProductionFieldList?: Caching<IGenericResponseType[]>;
  ProductionOperatordList?: Caching<IGenericResponseType[]>;
  VATPercentage?: Caching<IGenericResponseType[]>;
  ClaimStatus?: Caching<IGenericResponseType[]>;
  JobTitleOfUsers?: Caching<IGenericResponseType[]>;
  StatusOfUsers?: Caching<IGenericResponseType[]>;
  ProducersList?: Caching<IGenericResponseType[]>;
  UserSecurityRoles?: Caching<IGenericResponseType[]>;
  Currencies?: IGenericResponseType[];
  RejectionReasons?: Caching<IGenericResponseType[]>;
  ProspectsReportsTypes?: Caching<IGenericResponseType[]>;
  ClaimCaseTypes?: Caching<IGenericResponseType[]>;
  MotorClaimTypes?: Caching<IGenericResponseType[]>;
  TypesOfRepair?: Caching<IGenericResponseType[]>;
  Hospitals?: Caching<IGenericResponseType[]>;
  CarsModels?: Caching<IGenericResponseType[]>;
  Cities?: Caching<IGenericResponseType[]>;
  ProductionReportType?: Caching<IGenericResponseType[]>;
  ProductionReportBasedOn?: Caching<IGenericResponseType[]>;
  ProductionReportCaptive?: Caching<IGenericResponseType[]>;
  ProductionReportStatus?: Caching<IGenericResponseType[]>;
  RenewalNoticeReportStatus?: Caching<IGenericResponseType[]>;
  CSReportType?: Caching<IGenericResponseType[]>;
  CSReportStatus?: Caching<IGenericResponseType[]>;
  ClaimsReportType?: Caching<IGenericResponseType[]>;
  VehicleCarsMake?: Caching<IGenericResponseType[]>;
  Regions?: Caching<IGenericResponseType[]>;
  TypeClaimsRejectionReason?: Caching<IGenericResponseType[]>;
  GetPolicyTypeIssue?: Caching<IGenericResponseType[]>;
  CategoryOfDefaultEmail?: Caching<IGenericResponseType[]>;
  TasksTypes?: Caching<IGenericResponseType[]>;
  IBSModules?: Caching<IGenericResponseType[]>;
}

export interface Caching<T> {
  cacheable: boolean;
  content: T;
}

export interface IAllClients {
  sNo: number;
  fullName: string;
  producer: string;
  status: string;
}

export interface IGenericResponseType {
  id: number;
  name: string;
}

export interface INationality {
  nationalityEn?: string;
  nationalityAr?: string;
}

export interface IBusinessActivity {
  sNo: number;
  businessActivity: string;
}

export interface IPositions {
  sNo: number;
  position: string;
}
export interface IBanks {
  sNo?: number;
  bankName?: string;
  swift?: string;
}

export interface IClientTypes {
  id: number;
  name: string;
}
