import { FormControl } from "@angular/forms";

export interface IClaimsForms {
  clientInfo?: FormControl<string | null>;

  SNo?: FormControl<number | null>;
  Branch?: FormControl<string | null>;
  CNo?: FormControl<string | null>;
  ClaimNo?: FormControl<string | null>;
  PoliciesSNo?: FormControl<string | null>;

  /* Policy Details Tap */
  ClientID?: FormControl<string | null>;
  ClientName?: FormControl<string | null>;
  insuranceCompany?: FormControl<string | null>;
  policyNo?: FormControl<string | null>;
  className?: FormControl<string | null>;
  lineOfBusiness?: FormControl<string | null>;
  dateOfLossFrom?: FormControl<Date | null>; //Inception Date
  dateOfLossTo?: FormControl<Date | null>; //Expiry Date
  projectTitle?: FormControl<string | null>;
  MaintenancePeriodFrom?: FormControl<Date | null>;
  MaintenancePeriodTo?: FormControl<Date | null>;
  previousClaimsNo?: FormControl<number | null>;
  //  IEnumerable<ClaimTransactionDto> ClaimTransactions  = new List<ClaimTransactionDto>(); // Just For Presentation
  /****************** End ************************/

  /* Payment Tap 1- Claim Details */
  insurCompClaimNo?: FormControl<string | null>;
  insuredClaimNo?: FormControl<string | null>;
  membName?: FormControl<string | null>;
  bLAWBNo?: FormControl<string | null>;

  //Claimant Details
  claimantMobile?: FormControl<string | null>;
  claimantEmail?: FormControl<string | null>;
  claimantIBAN?: FormControl<string | null>;
  bankName?: FormControl<string | null>;
  bankBranch?: FormControl<string | null>;
  bankCity?: FormControl<string | null>;

  //Claim Amount
  ckClaimAmount?: FormControl<boolean | null>;
  claimAmount?: FormControl<number | null>;
  otherCurrAmount?: FormControl<number | null>;
  otherCurr?: FormControl<string | null>;
  exchangeRate?: FormControl<number | null>;
  estimatedValue?: FormControl<number | null>;
  salvage?: FormControl<number | null>;

  //Contact Details
  contactName?: FormControl<string | null>;
  contactEmail?: FormControl<string | null>;
  contactTele?: FormControl<string | null>;
  notes?: FormControl<string | null>;

  //Required Document
  //  IEnumerable<BaseLookUpDto> requiredDocumentList  = new List<BaseLookUpDto>();
  //   RequiredDocuments

  //claim Details Dates
  chIntimationDate?: FormControl<boolean | null>;
  intimationDate?: FormControl<Date | null>;

  chDateOfLoss?: FormControl<boolean | null>;
  dateOfLoss?: FormControl<Date | null>; //Accident / Bill Date

  chDateOfReceive?: FormControl<boolean | null>;
  dateOfReceive?: FormControl<Date | null>; //Receive Date

  chDateofSubmission?: FormControl<boolean | null>;
  dateOfSubmission?: FormControl<Date | null>;

  chDateOfDeadline?: FormControl<boolean | null>;
  dateOfDeadline?: FormControl<Date | null>;

  status?: FormControl<string | null>;
  claimStatusNotes?: FormControl<string | null>;
  //  IEnumerable<BaseLookUpDto> ClaimStatusNotesList  = new List<BaseLookUpDto>();

  //Loss Adjuster
  lostadjuster?: FormControl<string | null>;
  lostadjusterEmail?: FormControl<string | null>; //Reference
  lostadjusterTele?: FormControl<string | null>;
  /* End Tap 1 */

  // /* Payment Tap 2- Rejections / Deductions */
  //  IEnumerable<ClaimsRejectionsDeductionsDto> ClaimRejectionDeductionsList  = new List<ClaimsRejectionsDeductionsDto>();
  //   ClaimRejectionDeductions
  // /* End Tap 2 */

  // Tap 3 Docs
  //  List<IFormFile> Documents  = new List<IFormFile>();
  /* End Tap 3 */

  /***************        End Payment Tap     *****************/

  /* Medical */
  medID?: FormControl<string | null>;
  hospital?: FormControl<string | null>;
  medClass?: FormControl<string | null>; //Added M
  medCaseType?: FormControl<string | null>; //Added M
  /***************        End Medical       *****************/

  /* Motor  */
  carPaletNo?: FormControl<string | null>;
  mistakePercentage?: FormControl<number | null>;
  claimType?: FormControl<string | null>; //MOT GEN
  motorChassisNo?: FormControl<string | null>;
  type?: FormControl<string | null>; // Own Damage , Total Loss
  carsMake?: FormControl<string | null>;
  model?: FormControl<string | null>;
  typeOfrepair?: FormControl<string | null>;
  city?: FormControl<string | null>;
  workshopAgency?: FormControl<string | null>;
  //  IEnumerable<BaseLookUpDto> WorkshopAgencyList  = new List<BaseLookUpDto>();
  accidentNumber?: FormControl<string | null>;
  TPL?: FormControl<number | null>;
  excess?: FormControl<number | null>;
  policyExcess?: FormControl<string | null>;
  policyCertificateNo?: FormControl<string | null>;

  /***************        End Motor       *****************/

  /* General  */
  nameofInjured?: FormControl<string | null>;
  natureofLoss?: FormControl<string | null>;
  lossLocation?: FormControl<string | null>;
  claimExcess?: FormControl<number | null>;
  interimPayment?: FormControl<number | null>;
  recovery?: FormControl<string | null>;
  liability?: FormControl<string | null>;
  claimCertificateNo?: FormControl<string | null>;
  declarationNo?: FormControl<string | null>;
  shipmentName?: FormControl<string | null>;
  generalChassisNo?: FormControl<string | null>;
  //  IEnumerable<ClaimGeneralDto> ClaimsGeneral  = new List<ClaimGeneralDto>();
  //   ClaimsGeneral

  /***************        End General       *****************/

  InsuranceCompanyDNCNNo?: FormControl<string | null>;
  DriverAge?: FormControl<string | null>;
  NetworkProvider?: FormControl<string | null>;
  Dealer?: FormControl<string | null>;
  TreatmentType?: FormControl<string | null>;

  ClaimsSpecialConditions?: FormControl<string | null>;
  CSSpecialConditions?: FormControl<string | null>;
  ApprovedAmount?: FormControl<number | null>;
  Deductible?: FormControl<number | null>;

  DateOfReminder?: FormControl<Date | null>;

  filterAccidentCheckbox?: FormControl<string | null>;
  ClientNameID?: FormControl<string | null>;
  Region?: FormControl<string | null>;
  MngRejectInfo?: FormControl<string | null>;
  PaymentType?: FormControl<string | null>;
  PaymentDetails?: FormControl<string | null>;
}
