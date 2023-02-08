export enum searchBy {
  client = "Client",
  request = "Request",
}

export enum issueType {
  new = "new",
  renewal = "renewal",
  endorsement = "endorsement",
}

export interface IFilterByRequest {
  dateFrom?: string;
  dateTo?: string;
  clientName?: string;
}

export interface IPolicyRequests {
  requestNo?: string;
  endorsType?: string;
  policyNo?: string;
  clientID?: string;
  classOfBusiness?: string;
  lineOfBusiness?: string;
  status?: string;
  policySerial?: string;
  clientPolicySNo?: string;
  clieNetPremiumntPolicySNo?: string;
  vatPerc?: string;
  policyFees?: string;
  clientName?: string;
  producer?: string;
}
