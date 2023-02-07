import { FormControl } from "@angular/forms";

export interface IProductionForms {
  sNo?: FormControl<string | null>;
  searchType?: FormControl<string | null>;
  producer?: FormControl<string | null>;
  chPolicyHolder?: FormControl<boolean | null>;
  policyHolder?: FormControl<string | null>;
  requestInfo?: FormControl<string | null>;
  clientInfo?: FormControl<string | null>;
  clientName?: FormControl<string | null>;
}
