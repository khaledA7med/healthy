import { HttpContextToken } from "@angular/common/http";

export const MODULE_NAME = new HttpContextToken<string | undefined>(
  () => undefined
);
export enum MODULES {
  Client = "Client",
  ClientForm = "ClientForm",
  BusinessDevelopment = "BusinessDevelopment",
  Production = "Production",
  CustomerService = "CustomerService",
  CustomerServiceForm = "CustomerServiceForm",
}
