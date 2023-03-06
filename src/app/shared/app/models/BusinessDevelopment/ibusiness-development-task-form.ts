import { FormControl } from "@angular/forms";

export interface ISalesleadTaskForm {
	allDay?: FormControl<Boolean | null>;
	Module?: FormControl<string | null>;
	ModuleSNo?: FormControl<number | null>;
	ClientName?: FormControl<string | null>;
	Type?: FormControl<string | null>;
	DueDateFrom?: FormControl<Date | null>;
	DueDateTo?: FormControl<Date | null>;
	TaskName?: FormControl<string | null>;
	TaskDetails?: FormControl<string | null>;
	AssignedTo?: FormControl<string | null>;
}
