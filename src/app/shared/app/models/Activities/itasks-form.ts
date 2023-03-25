import { FormControl } from "@angular/forms";

export interface ITasksForm {
  id?: FormControl<string | null>; // moduleSNo,
  title?: FormControl<string | null>; // updatedTitle,
  start?: FormControl<Date | null>; // start_date,
  end?: FormControl<Date | null>; // end_date,
  description?: FormControl<string | null>; // eventDescription,
  isAllDay?: FormControl<boolean | null>; // all_day,
  module?: FormControl<string | null>; // updatedModule,
  moduleSNo?: FormControl<number | null>; // moduleSNo,
  type?: FormControl<string | null>; // updatedType,
  dueDateFrom?: FormControl<string | null>; // start_date.toJSON(),
  dueDateTo?: FormControl<string | null>; // end_date?.toJSON(),
  timeStampFrom?: FormControl<number | null>; // (start_date.getTime() / 1000),
  timeStampTo?: FormControl<number | null>; // (end_date.getTime() / 1000),
  status?: FormControl<string | null>; // '',
  taskName?: FormControl<string | null>; // updatedTitle,
  taskDetails?: FormControl<string | null>; // eventDescription,
  taskClosingNotes?: FormControl<string | null>; // '',
  assignedTo?: FormControl<string | null>; // updatedAssignTo,
  clientName?: FormControl<string | null>; // updatedClientName

  startTime?: FormControl<string | null>; // updatedClientName
  endTime?: FormControl<string | null>; // updatedClientName

  sNo?: FormControl<number | null>; // eventid,
}
