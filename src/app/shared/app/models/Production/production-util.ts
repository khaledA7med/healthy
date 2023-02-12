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

export enum IPolicyStatus {
  active = "Active",
  pending = "Pending",
  expired = "Expired",
  approvedByProduction = "Approved by Production",
  rejectedByProduction = "Rejected by Production",
  rejectedByFinance = "Rejected by Finance",
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

export interface IPolicyClient {
  sNo?: string;
  status?: string;
  fullName?: string;
  producer?: string;
}

export interface IPoliciesRef {
  sNo: string;
  insurComp: string;
  className: string;
  lineOfBusiness: string;
  accNo: string;
  policyNo: string;
  periodFrom: string;
  periodTo: string;
  policiesSNo: string;
}

export function refundChecker(params: any) {
  return params.data &&
    (params.data.endorsType === "Refund" ||
      params.data.endorsType === "Cancellation")
    ? ["input-text-right", "text-danger"]
    : ["input-text-right"];
}
