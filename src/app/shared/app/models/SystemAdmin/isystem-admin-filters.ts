import { FormControl } from "@angular/forms";
import { IBaseFilters } from "../App/IBaseFilters";

export interface ISystemAdminFiltersForm {
	fullName?: FormControl<string | null>;
	branch?: FormControl<string | null>;
	jobTitle?: FormControl<string | null>;
	status?: FormControl<string | null>;
}
export interface ISystemAdminFilters extends IBaseFilters {
	fullName?: string | null;
	branch?: string | null;
	jobTitle?: string | null;
	status?: string | null;
}
