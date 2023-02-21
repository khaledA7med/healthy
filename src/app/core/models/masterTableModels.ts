export enum BaseData
{
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
  StatusOfUsers = "StatusOfUsers"
}

export interface IBaseMasterTable
{
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
}

export interface Caching<T>
{
  cacheable: boolean;
  content: T;
}

export interface IAllClients
{
  sNo: number;
  fullName: string;
  producer: string;
  status: string;
}

export interface IGenericResponseType
{
  id: number;
  name: string;
}

export interface INationality
{
  nationalityEn?: string;
  nationalityAr?: string;
}

export interface IBusinessActivity
{
  sNo: number;
  businessActivity: string;
}

export interface IPositions
{
  sNo: number;
  position: string;
}
export interface IBanks
{
  sNo?: number;
  bankName?: string;
  swift?: string;
}

export interface IClientTypes
{
  id: number;
  name: string;
}
