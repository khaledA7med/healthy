import { FormControl } from "@angular/forms";
import { IBaseFilters } from "../App/IBaseFilters";

export interface ICustomerServiceFiltersForm {
	client?: FormControl<string | null>;
	status?: FormControl<string[] | null>;
	type?: FormControl<string[] | null>;
	requestNo?: FormControl<string | null>;
	branch?: FormControl<string | null>;
	insuranceCompany?: FormControl<string | null>;
	pendingReason?: FormControl<string | null>;
	classOfBusniess?: FormControl<string | null>;
	createdBy?: FormControl<string | null>;
	duration?: FormControl<string | null>;
	deadline?: FormControl<Date | null>;
	chassisNo?: FormControl<string | null>;
	deadlineFrom?: FormControl<Date | null>;
	deadlineTo?: FormControl<Date | null>;
}
export interface ICustomerServiceFilters extends IBaseFilters {
	client?: string | null;
	status?: string[] | null;
	type?: string[] | null;
	requestNo?: string | null;
	branch?: string | null;
	insuranceCompany?: string | null;
	pendingReason?: string | null;
	classOfBusniess?: string | null;
	createdBy?: string | null;
	duration?: string | null;
	deadline?: Date | null;
	chassisNo?: string | null;
	deadlineFrom?: Date | null;
	deadlineTo?: Date | null;
}
