import { HttpContextToken } from "@angular/common/http";

export const MODULE_NAME = new HttpContextToken<string | undefined>(() => undefined);

export enum MODULES
{
	Client = "Client",
	ClientForm = "ClientForm",
	BusinessDevelopmentForm = "BusinessDevelopmentForm",
	BusinessDevelopment = "BusinessDevelopment",
	Production = "Production",
	ProductionForm = "ProductionForm",
	CustomerService = "CustomerService",
	CustomerServiceForm = "CustomerServiceForm",
	Claims = "Claims",
	SystemAdmin = "SystemAdmin",
}
