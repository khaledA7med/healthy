import { FormControl } from "@angular/forms";
import { IBaseFilters } from "../App/IBaseFilters";

export interface IProductionFiltersForm {
	status?: FormControl<string[] | null>;
	branch?: FormControl<string | null>;
	ourRef?: FormControl<string | null>;
	clientName?: FormControl<string | null>;
	producer?: FormControl<string[] | string | null>;
	insurCompany?: FormControl<string | null>;
	classOfInsurance?: FormControl<string | null>;
	lineOfBusiness?: FormControl<string | null>;
	policyNo?: FormControl<string | null>;
	endorsNo?: FormControl<string | null>;
	policyEndorsType?: FormControl<string | null>;
	clientDNCNNo?: FormControl<string | null>;
	companyCommisionDNCNNo?: FormControl<string | null>;
	ourDNCNNo?: FormControl<string | null>;
	createdBy?: FormControl<string | null>;
	issueFrom?: FormControl<Date | null>;
	issueTo?: FormControl<Date | null>;
	financeApproveFrom?: FormControl<Date | null>;
	financeApproveTo?: FormControl<Date | null>;
	inceptionFrom?: FormControl<Date | null>;
	inceptionTo?: FormControl<Date | null>;
	financeEntryFrom?: FormControl<Date | null>;
	financeEntryTo?: FormControl<Date | null>;
	amount?: FormControl<boolean | null>;
	field?: FormControl<string | null>;
	operatordList?: FormControl<string | null>;
	amountNo?: FormControl<string | null>;
	amountNo2?: FormControl<string | null>;
}
export interface IProductionFilters extends IBaseFilters {
	status?: string[] | null;
	branch?: string | null;
	ourRef?: string | null;
	clientName?: string | null;
	producer?: string[] | string | null;
	insurCompany?: string | null;
	classOfInsurance?: string | null;
	lineOfBusiness?: string | null;
	policyNo?: string | null;
	endorsNo?: string | null;
	policyEndorsType?: string | null;
	clientDNCNNo?: string | null;
	companyCommisionDNCNNo?: string | null;
	ourDNCNNo?: string | null;
	createdBy?: string | null;
	issueFrom?: Date | null;
	issueTo?: Date | null;
	financeApproveFrom?: Date | null;
	financeApproveTo?: Date | null;
	inceptionFrom?: Date | null;
	inceptionTo?: Date | null;
	financeEntryFrom?: Date | null;
	financeEntryTo?: Date | null;
	amount?: boolean | null;
	field?: string | null;
	operatordList?: string | null;
	amountNo?: string | null;
	amountNo2?: string | null;
}
