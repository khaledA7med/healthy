import { FormControl } from "@angular/forms";
export interface IPolicyRequirement {
  leadNo?: FormControl<string | null>;
  itemCheck: FormControl<boolean | null>;
  insuranceCopmany: FormControl<string | null>;
  item: FormControl<string | null>;
}
