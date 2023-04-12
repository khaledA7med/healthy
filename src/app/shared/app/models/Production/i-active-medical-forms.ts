import { FormControl } from "@angular/forms";

export interface MedicalDataForm {
  sNo?: FormControl<number | null>;
  oasisPolRef?: FormControl<string | null>;
  policiesSNo?: FormControl<number | null>;
  policyNo?: FormControl<string | null>;
  clientID?: FormControl<number | null>;
  idIqamaNo?: FormControl<string | null>;
  membershipNo?: FormControl<string | null>;
  memberName?: FormControl<string | null>;
  dob?: FormControl<Date | null>;
  relation?: FormControl<string | null>;
  maritalStatus?: FormControl<string | null>;
  gender?: FormControl<string | null>;
  sponsorNo?: FormControl<string | null>;
  endtNo?: FormControl<string | null>;
  class?: FormControl<string | null>;
  city?: FormControl<string | null>;
  staffNo?: FormControl<string | null>;
  premium?: FormControl<number | null>;
  mobileNo?: FormControl<string | null>;
  nationality?: FormControl<string | null>;
  cchiStatus?: FormControl<string | null>;
}

export interface MedicalData {
  sNo?: number | null;
  oasisPolRef?: string | null;
  policiesSNo?: number | null;
  policyNo?: string | null;
  clientID?: number | null;
  idIqamaNo?: string | null;
  membershipNo?: string | null;
  memberName?: string | null;
  dob?: Date | null;
  relation?: string | null;
  maritalStatus?: string | null;
  gender?: string | null;
  sponsorNo?: string | null;
  endtNo?: string | null;
  class?: string | null;
  city?: string | null;
  staffNo?: string | null;
  premium?: number | null;
  mobileNo?: string | null;
  nationality?: string | null;
  cchiStatus?: string | null;
}
