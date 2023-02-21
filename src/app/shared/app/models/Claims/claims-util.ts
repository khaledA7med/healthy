import { IBaseFilters } from "../App/IBaseFilters";

export enum ClaimsType {
  Medical = "Medical",
  Motor = "Motor",
  General = "General",
}

export interface IClaimPoliciesSearch extends IBaseFilters {
  clientName?: string | null;
  policyNo?: string | null;
  insuranceCompany?: string | null;
  classOfInsurance?: string | null;
  lineOfBusiness?: string | null;
}

export interface IClaimPolicies {
  sNo?: number;
  clientName?: string;
  insurComp?: string;
  className?: string;
  lineOfBusiness?: string;
  policyNo?: string;
  remarks?: string;
  sumInsur?: number;
  periodFrom?: string;
  periodTo?: string;
  clientNo?: string;
  oasisPolRef?: string;
  maintenancePeriodMonths?: string;
  identity?: string;
}
