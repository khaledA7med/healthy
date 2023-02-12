import { HttpContextToken } from "@angular/common/http";

export const MODULE_NAME = new HttpContextToken<string | undefined>(
  () => undefined
);
export enum MODULES {
  Client = "Client",
  ClientForm = "ClientForm",
  BusinessDevelopmentForm = "BusinessDevelopmentForm",
  BusinessDevelopment = "BusinessDevelopment",
  ProductionForm = "ProductionForm",
  Production = "Production",
  CustomerService = "CustomerService",
  CustomerServiceForm = "CustomerServiceForm",
}
