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
  AllClients = "AllClients",
  InsuranceCompanies = "InsuranceCompanies",
  CServiceStatus = "CServiceStatus",
  PendingReason = "PendingReason",
  AllUsers = "AllUsers",
  InsurClasses = "InsurClasses",
  TypeOfCustomerServices = "TypeOfCustomerServices"
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
  AllClients?: Caching<IAllClients[]>;
  CSRegistryClients?: Caching<IGenericResponseType[]>;
  InsuranceCompanies?: Caching<IGenericResponseType[]>;
  CServiceStatus?: Caching<IGenericResponseType[]>;
  PendingReason?: Caching<IGenericResponseType[]>;
  AllUsers?: Caching<IGenericResponseType[]>;
  InsurClasses?: Caching<IGenericResponseType[]>;
  TypeOfCustomerServices?: Caching<IGenericResponseType[]>;
}

export interface Caching<T>
{
  cacheable: boolean;
  content: T;
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

export interface IAllClients
{
  sNo: number;
  fullName: string;
  producer: string;
  status: string;
}