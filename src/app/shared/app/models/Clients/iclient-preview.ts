import { IClientDocumentList } from "./iclient-documentList";
import { IClient } from "./iclient";

export interface IClientPreview extends IClient {
  policyType?: string;
  officalName?: string;
  relationshipStatus?: string;
  oldClientID?: string;
  newClientID?: string;
  oldAccNoONB?: string;
  oldAccNoOFB?: string;
  prospID?: number;
  clientImportance?: string;
  registrationStatus?: string;
  businessActivity?: string;
  marketSegment?: string;
  location?: string;
  dateOfIncorporation?: Date;
  dateOfIncorporationHijri?: string;
  placeOfIncorporation?: string;
  expiryDate?: Date;
  expiryDateHijri?: string;
  coCountry?: string;
  registeredEntity?: string;
  email?: string;
  vatNo?: string;
  sponsorID?: string;
  nameOfExternal?: string;
  addressOfExternalAuditor?: string;
  tele?: string;
  tele2?: string;
  mobile?: string;
  fax?: string;
  poBox?: string;
  waselAddress?: string;
  claimsDeadline?: number;
  csDeadline?: number;
  website?: string;
  capital?: string;
  otherDetails?: string;
  buildingNo?: string;
  streetName?: string;
  districtName?: string;
  cityName?: string;
  zip?: string;
  additionalNo?: string;
  unitNo?: string;
  contactPersonName?: string;
  transDate?: Date;
  userName?: string;
  welcomeEmailSentFlag?: string;
  id?: string;
  idNo?: string;
  idExpiryDate?: Date;
  nationality?: string;
  sourceofIncome?: string;
  channel?: string;
  interface?: string;
  screeningResult?: string;
  premium?: string;
  updatedBy?: string;
  updatedOn?: Date;
  clientContactsArray?: string;
  clientsBankAccountsArray?: string;
  unifiedNo?: string;
  businessType?: string;
  notes?: string;
  insuranceCompany?: string;
  extension?: string;
  secondryNo?: string;
  postalCode?: string;
  documentLists?: IClientDocumentList[];
  clientContacts?: any[];
  clientsBankAccounts?: any[];
}
