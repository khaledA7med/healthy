import { FormControl } from "@angular/forms";

export interface ISalesleadTask {
	allDay?: Boolean | null;
	Module?: string | null;
	ModuleSNo?: number | null;
	ClientName?: string | null;
	Type?: string | null;
	DueDateFrom?: Date | null;
	DueDateTo?: Date | null;
	TaskName?: string | null;
	TaskDetails?: string | null;
	AssignedTo?: string | null;
}
