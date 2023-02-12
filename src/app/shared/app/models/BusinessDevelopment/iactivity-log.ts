import { FormControl } from "@angular/forms";
export interface IActivityLog {
  sNo?: FormControl<number | null>;
  logDate?: FormControl<string | null>;
  logType?: FormControl<string | null>;
  logNotes?: FormControl<string | null>;
  leadNo?: FormControl<string | null>;
}