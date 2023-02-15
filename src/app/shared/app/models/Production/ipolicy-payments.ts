import { FormControl } from "@angular/forms";

export interface IPolicyPaymentsListForms {
  policiesSNo?: FormControl<number>;
  payDate?: FormControl<Date | null>;
  percentage?: FormControl<number | null>;
  amount?: FormControl<number | null>;
  policyFees?: FormControl<number | null>;
  vatAmount?: FormControl<number | null>;
  rowTotal?: FormControl<number | null>;
}

export interface IPolicyCommissionListForms {
  policiesSNo?: FormControl<number | null>;
  producer?: FormControl<string | null>;
  percentage?: FormControl<number | null>;
  amount?: FormControl<number | null>;
  rowTotal?: FormControl<number | null>;
}
