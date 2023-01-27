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

export interface IBaseMasterTable {
  ClientTypes?: IGenericResponseType[];
  Producers?: IGenericResponseType[];
  RelationshipStatus?: IGenericResponseType[];
  BusinessType?: IGenericResponseType[];
  Channels?: IGenericResponseType[];
  Interface?: IGenericResponseType[];
  ScreeningResult?: IGenericResponseType[];
  Nationalities?: INationality[];
  SourceofIncome?: IGenericResponseType[];
  RegistrationStatus?: IGenericResponseType[];
  BusinessActivities?: IBusinessActivity[];
  MarketSegment?: IGenericResponseType[];
  Premium?: IGenericResponseType[];
  Positions?: IPositions[];
  Branch?: IGenericResponseType[];
  ContactLineOfBusiness?: IGenericResponseType[];
  ContactDepartment?: IGenericResponseType[];
  Banks?: IBanks[];
  CommericalNo?: IGenericResponseType[];
}
