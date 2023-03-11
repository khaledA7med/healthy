import { FormControl } from "@angular/forms";

export interface productionReportForm {
	branchs?: FormControl<string[] | null>;
	clientData?: FormControl<string | null>;
	clientGroup?: FormControl<string | null>;
	transactionType?: FormControl<string[] | null>;
	producers?: FormControl<string[] | null>;
	insuranceCompany?: FormControl<string[] | null>;
	classOfBusiness?: FormControl<string[] | null>;
	lineOfBusiness?: FormControl<string[] | null>;
	reportType?: FormControl<number | null>;
	basedOn?: FormControl<number | null>;
	status?: FormControl<number | null>;
	captive_NonPactive?: FormControl<number | null>;
	minDate?: FormControl<Date | null>;
	maxDate?: FormControl<Date | null>;
}
export interface productionReportReq {
	branchs?: string[] | null;
	clientData?: string | null;
	clientGroup?: string | null;
	transactionType?: string[] | null;
	producers?: string[] | null;
	insuranceCompany?: string[] | null;
	classOfBusiness?: string[] | null;
	lineOfBusiness?: string[] | null;
	reportType?: number | null;
	basedOn?: number | null;
	status?: number | null;
	captive_NonPactive?: number | null;
	minDate?: Date | null;
	maxDate?: Date | null;
}
