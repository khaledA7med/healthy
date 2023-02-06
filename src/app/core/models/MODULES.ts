import { HttpContextToken } from "@angular/common/http";

export const MODULE_NAME = new HttpContextToken<string | undefined>(
  () => undefined
);
export enum MODULES
{
  Client = "Client",
  ClientForm = "ClientForm",
  CustomerService = "CustomerService",
  CustomerServiceForm = "CustomerServiceForm"
}
