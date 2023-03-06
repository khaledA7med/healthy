import { FormControl } from "@angular/forms";

export interface IPolicyRenewalReportForm {
	branchs?: FormControl<string[] | null>;
	insuranceCompany?: FormControl<string[] | null>;
	classOfBusiness?: FormControl<string[] | null>;
	clientData?: FormControl<string | null>;
	producer?: FormControl<string | null>;
	minDate?: FormControl<Date | null>;
	maxDate?: FormControl<Date | null>;
}

export interface IPolicyRenewalReportReq {
	branchs?: string[] | null;
	insuranceCompany?: string[] | null;
	classOfBusiness?: string[] | null;
	clientData?: string | null;
	producer?: string | null;
	minDate?: Date | null;
	maxDate?: Date | null;
}
