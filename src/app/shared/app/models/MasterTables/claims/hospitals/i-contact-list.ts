import { FormControl } from "@angular/forms";

export interface IContactList {
  sNo?: FormControl<number | null>;
  HospitalId?: FormControl<number | null>;
  Name?: FormControl<string | null>;
  Position?: FormControl<string | null>;
  Email?: FormControl<string | null>;
  Phone?: FormControl<string | null>;
  SavedUser?: FormControl<string | null>;
}

export interface IContactListData {
  sNo?: number;
  HospitalId?: number;
  Name?: string;
  Position?: string;
  Email?: string;
  Phone?: string;
  SavedUser?: string;
}
