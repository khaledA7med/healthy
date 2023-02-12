import { FormControl } from "@angular/forms";
export interface IRequirement {
  sNo?: FormControl<number | null>;
  leadNo?: FormControl<string | null>;
  itemCheck?: FormControl<Boolean | null>;
  insuranceCopmany?: FormControl<string | null>;
  item?: FormControl<string | null>;
}