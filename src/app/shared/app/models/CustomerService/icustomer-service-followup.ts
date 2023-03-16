import { FormControl } from "@angular/forms";

export interface ICustomerServiceFollowUpForm {
	no?: FormControl<string | null>;
	msg?: FormControl<string | null>;
	names?: FormControl<string[] | null>;
}
export interface ICustomerServiceFollowUpData {
	no?: string | null;
	msg?: string | null;
	names?: string[] | null;
}
export interface ICustomerServiceFollowUp {
	sNo?: number | null;
	requestNo?: string | null;
	notes?: string | null;
	savedDate?: Date | null;
	savedUser?: string | null;
}
