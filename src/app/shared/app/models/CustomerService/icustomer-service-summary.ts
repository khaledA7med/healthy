export interface ICustomerServiceSummary {
  activeRequestsByClient: IActiveRequestsByClient[];
  activeRequestsByInsuranceCompany: IActiveRequestsByInsuranceCompany[];
  activeRequestsByClassOfBusiness: IActiveRequestsByClassOfBusiness[];
}

export interface IActiveRequestsByClient {
  clientID?: number;
  clientName?: string;
  noOfRequests?: number;
  producer?: string;
}

export interface IActiveRequestsByInsuranceCompany {
  insurComp?: string;
  noOfRequests?: number;
}

export interface IActiveClientWithInsurance
  extends IActiveRequestsByClient,
    IActiveRequestsByInsuranceCompany {}

export interface IActiveRequestsByClassOfBusiness {
  classOfBusiness?: string;
  count?: number;
}
