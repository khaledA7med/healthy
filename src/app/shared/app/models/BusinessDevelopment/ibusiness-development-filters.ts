import { FormControl } from "@angular/forms";
import { IBaseFilters } from "../App/IBaseFilters";

export interface IBusinessDevelopmentFiltersForm {
	status?: FormControl<string[] | null>;
	leadType?: FormControl<string | null>;
	clientName?: FormControl<string | null>;
	groupName?: FormControl<string | null>;
	producer?: FormControl<string[] | null>;
	branch?: FormControl<string | null>;
	user?: FormControl<string | null>;
	underWriter?: FormControl<string | null>;
	classOfBusiness?: FormControl<string[] | null>;
	lineOfBusiness?: FormControl<string[] | null>;
	deadline?: FormControl<Date | null>;
	deadlineFrom?: FormControl<Date | null>;
	deadlineTo?: FormControl<Date | null>;
	savedOn?: FormControl<Date | null>;
	savedOnFrom?: FormControl<Date | null>;
	savedOnTo?: FormControl<Date | null>;
	expireIn?: FormControl<string | null>;
	chExpireIn?: FormControl<string | null>;
}
export interface IBusinessDevelopmentFilters extends IBaseFilters {
	status?: string[] | null;
	leadType?: string | null;
	clientName?: string | null;
	groupName?: string | null;
	producer?: string[] | null;
	branch?: string | null;
	user?: string | null;
	underWriter?: string | null;
	classOfBusiness?: string[] | null;
	lineOfBusiness?: string[] | null;
	deadline?: Date | null;
	deadlineFrom?: Date | null;
	deadlineTo?: Date | null;
	savedOn?: Date | null;
	savedOnFrom?: Date | null;
	savedOnTo?: Date | null;
	expireIn?: string | null;
	chExpireIn?: string | null;
}
