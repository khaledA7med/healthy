import { FormControl } from "@angular/forms";
import { IBaseFilters } from "../App/IBaseFilters";

export interface IActiveListFiltersForm {
	status?: FormControl<string[] | null>;
	producer?: FormControl<string[] | string | null>;
	ourRef?: FormControl<string | null>;
	clientName?: FormControl<string | null>;
	insurCompany?: FormControl<string | null>;
	classOfInsurance?: FormControl<string | null>;
	lineOfBusiness?: FormControl<string | null>;
	policyNo?: FormControl<string | null>;
	createdBy?: FormControl<string | null>;
	inception?: FormControl<string | null>;
	inceptionFrom?: FormControl<string | null>;
	inceptionTo?: FormControl<string | null>;
	expiry?: FormControl<string | null>;
	expiryFrom?: FormControl<string | null>;
	expiryTo?: FormControl<string | null>;
}
export interface IActiveListFilters extends IBaseFilters {
	status?: string[] | null;
	producer?: string[] | string | null;
	ourRef?: string | null;
	clientName?: string | null;
	insurCompany?: string | null;
	classOfInsurance?: string | null;
	lineOfBusiness?: string | null;
	policyNo?: string | null;
	createdBy?: string | null;
	inception?: string | null;
	inceptionFrom?: string | null;
	inceptionTo?: string | null;
	expiry?: string | null;
	expiryFrom?: string | null;
	expiryTo?: string | null;
}
