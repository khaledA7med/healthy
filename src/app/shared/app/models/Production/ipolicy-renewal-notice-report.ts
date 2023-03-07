import { FormControl } from "@angular/forms";

export interface IPolicyRenewalNoticeReportForm {
	branch?: FormControl<string | null>;
	clientData?: FormControl<string | null>;
	clientGroup?: FormControl<string | null>;
	insuranceCompany?: FormControl<string[] | null>;
	classOfBusiness?: FormControl<string[] | null>;
	lineOfBusiness?: FormControl<string[] | null>;
	reportType: FormControl<number | null>;
	reportDate: FormControl<Date | null>;
	minDate?: FormControl<Date | null>;
	maxDate?: FormControl<Date | null>;
}

export interface IPolicyRenewalNoticeReportReq {
	branch?: string | null;
	clientData?: string | null;
	clientGroup?: string | null;
	insuranceCompany?: string[] | null;
	classOfBusiness?: string[] | null;
	lineOfBusiness?: string[] | null;
	reportType: number | null;
	reportDate: Date | null;
	minDate?: Date | null;
	maxDate?: Date | null;
}
