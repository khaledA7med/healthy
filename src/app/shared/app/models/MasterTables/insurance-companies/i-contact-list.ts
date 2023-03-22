import { FormControl } from "@angular/forms";

export interface IContactList {
  sNo?: FormControl<number | null>;
  companyID?: FormControl<number | null>;
  contactName?: FormControl<string | null>;
  contactPosition?: FormControl<string | null>;
  contactEmail?: FormControl<string | null>;
  contactMobileNo?: FormControl<string | null>;
  contactTele?: FormControl<string | null>;
  LineOfBusiness?: FormControl<string | null>;
  department?: FormControl<string | null>;
  address?: FormControl<string | null>;
  branch?: FormControl<string | null>;
  savedUser?: FormControl<string | null>;
  savedDate?: FormControl<string | null>;
}

export interface IContactListData {
  sNo?: number;
  companyID?: number;
  contactName?: string;
  contactPosition?: string;
  contactEmail?: string;
  contactMobileNo?: string;
  contactTele?: string;
  LineOfBusiness?: string;
  department?: string;
  address?: string;
  branch?: string;
  savedUser?: string;
  savedDate?: string;
}
