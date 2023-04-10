import { FormControl } from "@angular/forms";

export enum searchBy {
  client = "Client",
  request = "Request",
}

export enum issueType {
  new = "new",
  renewal = "renewal",
  endorsement = "endorsement",
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
}

export interface IPolicyRequestResponse {
  clientPolicy: {
    accNo: string;
    policyNo: string;
    insurComp: string;
    className: string;
    lineOfBusiness: string;
    periodTo: string;
    compCommPerc: string;
    producerCommPerc: string;
  };
  clientData: {
    sNo: string;
    oasisPolRef: string;
    clientNo: string;
    clientName: string;
    producer: string;
    endorsType: string;
    endorsNo: string;
    issueDate: Date;
    minDriverAge: string;
    numberOfBeneficiaries: string;
    periodFrom: Date;
    claimNoOfDays: string;
    csNoOfDays: string;
    sumInsur: string;
    remarks: string;
  };
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
  accNo: string;
  periodFrom: string;
  periodTo: string;
  policiesSNo: string;
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

export interface DCNotesModel {
  connectionType?: string | null;
  printedBy?: string | null;
  docSNo?: string | null;
  clientName?: string | null;
  type?: string | null;
  source?: string | null;
  plain?: boolean | null;
  userFullName?: string | null;
  pram?: number | null;
  reportType?: number | null;
}

export function refundChecker(params: any) {
  return params.data &&
    (params.data.endorsType === "Refund" ||
      params.data.endorsType === "Cancellation")
    ? ["input-text-right", "text-danger"]
    : ["input-text-right"];
}

//#testing data
export interface MedicalDataForm {
  sNo: FormControl<number | null>;
  oasisPolRef: FormControl<string | null>;
  policiesSNo: FormControl<number | null>;
  policyNo: FormControl<string | null>;
  clientID: FormControl<number | null>;
  valid: FormControl<number | null>;
  idIqamaNo: FormControl<string | null>;
  membershipNo: FormControl<string | null>;
  memberName: FormControl<string | null>;
  dob: FormControl<string | null>;
  relation: FormControl<string | null>;
  maritalStatus: FormControl<string | null>;
  gender: FormControl<string | null>;
  sponsorNo: FormControl<string | null>;
  endtNo: FormControl<string | null>;
  policyNumber: FormControl<string | null>;
  class: FormControl<string | null>;
  city: FormControl<string | null>;
  staffNo: FormControl<string | null>;
  premium: FormControl<number | null>;
  mobileNo: FormControl<string | null>;
  nationality: FormControl<string | null>;
  cchiStatus: FormControl<string | null>;
}

export interface MedicalData {
  sNo: number | null;
  oasisPolRef: string | null;
  policiesSNo: number | null;
  policyNo: string | null;
  clientID: number | null;
  valid: number | null;
  idIqamaNo: string | null;
  membershipNo: string | null;
  memberName: string | null;
  dob: string | null;
  relation: string | null;
  maritalStatus: string | null;
  gender: string | null;
  sponsorNo: string | null;
  endtNo: string | null;
  policyNumber: string | null;
  class: string | null;
  city: string | null;
  staffNo: string | null;
  premium: number | null;
  mobileNo: string | null;
  nationality: string | null;
  cchiStatus: string | null;
}
//#endregion
