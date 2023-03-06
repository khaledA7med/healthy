import { FormControl } from "@angular/forms";

export interface IClientReportFiltersForm {
	status?: FormControl<string[] | null>;
	name?: FormControl<string | null>;
	accountNumber?: FormControl<string | null>;
	crNO?: FormControl<string | null>;
	producer?: FormControl<string | null>;
	type?: FormControl<string | null>;
	branchs?: FormControl<string[] | null>;
	minDate?: FormControl<Date | null>;
	maxDate?: FormControl<Date | null>;
}

export interface IClientReportReq {
	status?: string[] | null;
	name?: string | null;
	accountNumber?: string | null;
	crNO?: string | null;
	producer?: string | null;
	type?: string | null;
	branchs?: string[] | null;
	minDate?: Date | null;
	maxDate?: Date | null;
}
