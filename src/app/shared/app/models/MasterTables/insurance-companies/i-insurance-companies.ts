import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { IContactList } from "./i-contact-list";
import { IProductsList } from "./i-products-list";

export interface IInsuranceCompanies {
  sNo?: FormControl<number | null>;
  identity?: FormControl<string | null>;
  companyName?: FormControl<string | null>;
  companyNameAr?: FormControl<string | null>;
  vatNo?: FormControl<string | null>;
  unifiedNo?: FormControl<string | null>;
  crNo?: FormControl<string | null>;
  fax?: FormControl<string | null>;
  tele1?: FormControl<string | null>;
  abbreviation?: FormControl<string | null>;
  otherDetails?: FormControl<string | null>;
  email?: FormControl<string | null>;
  address?: FormControl<string | null>;
  accNoCommAccrued?: FormControl<string | null>;
  accNoCommDue?: FormControl<string | null>;
  accNoVATAccrued?: FormControl<string | null>;
  accNoVATReceivable?: FormControl<string | null>;
  accNoGrossVAT?: FormControl<string | null>;
  accNoNetPremium?: FormControl<string | null>;
  accNoUWVATPayable?: FormControl<string | null>;
  createdBy?: FormControl<string | null>;
  createdOn?: FormControl<string | null>;
  approvedOn?: FormControl<string | null>;
  contactList?: FormArray<FormGroup<IContactList>>;
  productsList?: FormArray<FormGroup<IProductsList>>;
}
export interface IInsuranceCompaniesData {
  sNo?: number;
  identity?: string;
  companyName?: string;
  companyNameAr?: string;
  vatNo?: string;
  unifiedNo?: string;
  crNo?: string;
  fax?: string;
  tele1?: string;
  abbreviation?: string;
  otherDetails?: string;
  email?: string;
  address?: string;
  accNoCommAccrued?: string;
  accNoCommDue?: string;
  accNoVATAccrued?: string;
  accNoVATReceivable?: string;
  accNoGrossVAT?: string;
  accNoNetPremium?: string;
  accNoUWVATPayable?: string;
  createdBy?: string;
  createdOn?: string;
  approvedOn?: string;
  // contactList?: string[],
  companyID?: number;
  contactName?: string;
  contactPosition?: string;
  contactEmail?: string;
  contactMobileNo?: string;
  contactTele?: string;
  LineOfBusiness?: string;
  department?: string;
  branch?: string;
  savedUser?: string;
  savedDate?: string;
  // productsList?: string[]
  insurCompSNo?: number;
  classOfBusiness?: string;
  lineOfBusiness?: string;
  savedBy?: string;
  savedOn?: string;
}
