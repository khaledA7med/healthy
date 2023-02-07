import { FormControl } from "@angular/forms";
export interface ICompetitors {
  sNo?: FormControl<number | null>;
  leadNo?: FormControl<string | null>;
  competitor?: FormControl<string | null>;
  competitorNotes?: FormControl<string | null>;
  createdBy?: FormControl<string | null>;
  createdOn?: FormControl<Date | null>;
}
