import { FormControl } from "@angular/forms";

export interface IClientsBankAccount {
  sNo?: FormControl<number | null>;
  clientID?: FormControl<number | null>;
  bankName?: FormControl<string | null>;
  branch?: FormControl<string | null>;
  iban?: FormControl<string | null>;
  swiftCode?: FormControl<string | null>;
  fullName?: FormControl<string | null>;
  arabicName?: FormControl<string | null>;
  stauts?: FormControl<string | null>;
}
