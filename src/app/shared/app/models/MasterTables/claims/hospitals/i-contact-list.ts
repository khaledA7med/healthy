import { FormControl } from "@angular/forms";

export interface IContactList {
  sNo?: FormControl<number | null>;
  hospitalId?: FormControl<number | null>;
  name?: FormControl<string | null>;
  position?: FormControl<string | null>;
  email?: FormControl<string | null>;
  phone?: FormControl<string | null>;
  savedUser?: FormControl<string | null>;
}

export interface IContactListData {
  sNo?: number;
  hospitalId?: number;
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
  savedUser?: string;
}
