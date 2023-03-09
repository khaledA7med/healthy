import { FormControl } from "@angular/forms";

export interface claimsReportForm {
	branch?: FormControl<string | null>;
	clientData?: FormControl<string | null>;
	clientGroup?: FormControl<string | null>;
	status?: FormControl<string[] | null>;
	reportType?: FormControl<number | null>;
	subStatus?: FormControl<string[] | null>;
	rejectionReason?: FormControl<string | null>;
	insuranceCompany?: FormControl<string[] | null>;
	classOfBusiness?: FormControl<string[] | null>;
	lineOfBusiness?: FormControl<string[] | null>;
	minDate?: FormControl<Date | null>;
	maxDate?: FormControl<Date | null>;
	excludeZeroClaimAmount?: FormControl<boolean | null>;
}

export interface claimsReportReq {
	branch?: string | null;
	clientData?: string | null;
	clientGroup?: string | null;
	status?: string[] | null;
	reportType?: number | null;
	subStatus?: string[] | null;
	rejectionReason?: string | null;
	insuranceCompany?: string[] | null;
	classOfBusiness?: string[] | null;
	lineOfBusiness?: string[] | null;
	minDate?: Date | null;
	maxDate?: Date | null;
	excludeZeroClaimAmount?: boolean | null;
}
