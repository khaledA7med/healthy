import { FormControl } from "@angular/forms";
import { IBaseFilters } from "../App/IBaseFilters";

export interface debitCreditNoteForm {
	branchs?: FormControl<string | null>;
	filter?: FormControl<string | null>;
	plain?: FormControl<boolean | null>;
	pram?: FormControl<number | null>;
	reportType?: FormControl<number | null>;
	minDate?: FormControl<Date | null>;
	maxDate?: FormControl<Date | null>;
}
export interface IdebitCreditNoteFilter extends IBaseFilters {
	branchs?: string | null;
	filter?: string | null;
	plain?: boolean | null;
	pram?: number | null;
	reportType?: number | null;
	minDate?: Date | null;
	maxDate?: Date | null;
}
