import { HttpContextToken } from "@angular/common/http";

export const MODULE_NAME = new HttpContextToken<string | undefined>(
  () => undefined
);

export enum MODULES {
  Activities = "Activities",
  Client = "Client",
  ClientForm = "ClientForm",
  BusinessDevelopmentForm = "BusinessDevelopmentForm",
  BusinessDevelopment = "BusinessDevelopment",
  Production = "Production",
  ProductionForm = "ProductionForm",
  EditCommission = "EditCommission",
  CustomerService = "CustomerService",
  CustomerServiceForm = "CustomerServiceForm",
  Claims = "Claims",
  ClaimsForm = "ClaimsForm",
  SystemAdmin = "SystemAdmin",
  InsuranceClasses = "InsuranceClasses",
  LineOfBusiness = "LineOfBusiness",
  InsuranceCompanies = "InsuranceCompanies",
  QuotingRequirements = "QuotingRequirements",
  PolicyIssuanceRequirements = "PolicyIssuanceRequirements",
  MasterTableProductionLibraries = "MasterTableProductionLibraries",
  InsuranceCompaniesDocuments = "InsuranceCompaniesDocuments",
  CustomerServiceCompanyRequirements = "CustomerServiceCompanyRequirements",
  Hospitals = "Hospitals",
  InsuranceWorkshopDetails = "InsuranceWorkshopDetails",
  ClaimsGeneralItems = "ClaimsGeneralItems",
  ClaimsStatus = "ClaimsStatus",
  ClaimsRejectionReasons = "ClaimsRejectionReasons",
  MasterTableListOfRequiredDocuments = "MasterTableListOfRequiredDocuments",
  DefaultEmails = "DefaultEmails",
  Reports = "Reports",
}
