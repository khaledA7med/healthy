import { HttpContextToken } from "@angular/common/http";

export const MODULE_NAME = new HttpContextToken<string | undefined>(
  () => undefined
);

export enum MODULES {
  Client = "Client",
  ClientForm = "ClientForm",
  BusinessDevelopment = "BusinessDevelopment",
  BusinessDevelopmentForm = "BusinessDevelopmentForm",
  ProductionForm = "ProductionForm",
  CustomerService = "CustomerService",
  CustomerServiceForm = "CustomerServiceForm",
}
