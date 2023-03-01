import { FormControl } from "@angular/forms";

export interface IBusinessDevelopmentProspectsReportForm {
	branchs?: FormControl<string[] | null>;
	producers?: FormControl<string[] | null>;
	classofBusiness?: FormControl<string[] | null>;
	reportType?: FormControl<number | null>;
	maxDate?: FormControl<Date | null>;
	minDate?: FormControl<Date | null>;
}

export interface IBusinessDevelopmentProspectsReportReq {
	branchs?: string[] | null;
	producers?: string[] | null;
	classofBusiness?: string[] | null;
	reportType?: number | null;
	maxDate?: Date | null;
	minDate?: Date | null;
}
