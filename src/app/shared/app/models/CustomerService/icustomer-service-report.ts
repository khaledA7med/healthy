import { FormControl } from "@angular/forms";

export interface csReportForm {
	branch?: FormControl<string | null>;
	user?: FormControl<string | null>;
	classOfBusiness?: FormControl<string[] | null>;
	insuranceCompany?: FormControl<string[] | null>;
	clientData?: FormControl<string | null>;
	status?: FormControl<string[] | null>;
	reportType?: FormControl<number | null>;
	currentStatus?: FormControl<number | null>;
	minDate?: FormControl<Date | null>;
	maxDate?: FormControl<Date | null>;
}
export interface csReportReq {
	branch?: string | null;
	user?: string | null;
	classOfBusiness?: string[] | null;
	insuranceCompany?: string[] | null;
	clientData?: string | null;
	status?: string[] | null;
	reportType?: number | null;
	currentStatus?: number | null;
	minDate?: Date | null;
	maxDate?: Date | null;
}
