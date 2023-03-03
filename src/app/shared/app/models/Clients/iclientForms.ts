import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { IClientContact } from "./iclientContactForm";
import { IClientsBankAccount } from "./iclientsBankAccountForm";

export interface IClientForms {
  sNo?: FormControl<number | null>;
  status?: FormControl<string | null>;
  policyType?: FormControl<string | null>;
  fullName?: FormControl<string | null>;
  fullNameAr?: FormControl<string | null>;
  officalName?: FormControl<string | null>;
  relationshipStatus?: FormControl<string | null>;
  businessType?: FormControl<string | null>;
  type?: FormControl<string | null>;

  retail?: FormGroup<IClientRetailForm>;

  // idNo?: FormControl<string | null>;
  // idExpiryDate?: FormControl<Date | null>;
  // nationality?: FormControl<string | null>;
  // sourceofIncome?: FormControl<string | null>;

  corporate?: FormGroup<IClientCorporateForm>;
  // registrationStatus?: FormControl<string | null>;
  // businessActivity?: FormControl<string | null>;
  // marketSegment?: FormControl<string | null>;
  // commericalNo?: FormControl<string | null>;
  // dateOfIncorporation?: FormControl<Date | null>;
  // dateOfIncorporationHijri?: FormControl<Date | null>;
  // expiryDate?: FormControl<Date | null>;
  // expiryDateHijri?: FormControl<Date | null>;
  // sponsorID?: FormControl<string | null>;
  // unifiedNo?: FormControl<string | null>;
  // vatNo?: FormControl<string | null>;
  // capital?: FormControl<string | null>;
  // premium?: FormControl<string | null>;

  location?: FormControl<string | null>;

  buildingNo?: FormControl<string | null>;
  poBox?: FormControl<string | null>;
  tele?: FormControl<string | null>;
  tele2?: FormControl<string | null>;
  fax?: FormControl<string | null>;
  channel?: FormControl<string | null>;
  interface?: FormControl<string | null>;
  producer?: FormControl<string | null>;
  screeningResult?: FormControl<string | null>;
  branch?: FormControl<string | null>;
  createdBy?: FormControl<string | null>;
  streetName?: FormControl<string | null>;
  secondryNo?: FormControl<string | null>;
  districtName?: FormControl<string | null>;
  postalCode?: FormControl<string | null>;
  cityName?: FormControl<string | null>;
  email?: FormControl<string | null>;
  website?: FormControl<string | null>;
  clientContacts?: FormArray<FormGroup<IClientContact>>;
  clientsBankAccounts?: FormArray<FormGroup<IClientsBankAccount>>;
  documents?: FormControl<string[] | null>;
}

export interface IClientRetailForm {
  idNo?: FormControl<string | null>;
  idExpiryDate?: FormControl<Date | null>;
  nationality?: FormControl<string | null>;
  sourceofIncome?: FormControl<string | null>;
}

export interface IClientCorporateForm {
  registrationStatus?: FormControl<string | null>;
  businessActivity?: FormControl<string | null>;
  marketSegment?: FormControl<string | null>;
  commericalNo?: FormControl<string | null>;
  dateOfIncorporation?: FormControl<Date | null>;
  dateOfIncorporationHijri?: FormControl<Date | null>;
  expiryDate?: FormControl<Date | null>;
  expiryDateHijri?: FormControl<Date | null>;
  sponsorID?: FormControl<string | null>;
  unifiedNo?: FormControl<string | null>;
  vatNo?: FormControl<string | null>;
  capital?: FormControl<string | null>;
  premium?: FormControl<string | null>;
}
