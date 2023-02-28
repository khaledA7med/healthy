import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface IClaimsForms {
  clientInfo?: FormControl<string | null>;

  sNo?: FormControl<number | null>;
  branch?: FormControl<string | null>;
  cNo?: FormControl<string | null>;
  claimNo?: FormControl<string | null>;
  policiesSNo?: FormControl<string | null>;
  claimType?: FormControl<string | null>; //MOT GEN

  /* Policy Details Tap */
  clientID?: FormControl<string | null>;
  clientName?: FormControl<string | null>;
  insuranceCompany?: FormControl<string | null>;
  policyNo?: FormControl<string | null>;
  className?: FormControl<string | null>;
  lineOfBusiness?: FormControl<string | null>;
  dateOfLossFrom?: FormControl<Date | null>; //Inception Date
  dateOfLossTo?: FormControl<Date | null>; //Expiry Date
  projectTitle?: FormControl<string | null>;
  maintenancePeriodFrom?: FormControl<Date | null>;
  maintenancePeriodTo?: FormControl<Date | null>;
  previousClaimsNo?: FormControl<number | null>;
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
  claimAmounts?: FormGroup<IClaimAmountForm>;

  //Contact Details
  contactName?: FormControl<string | null>;
  contactEmail?: FormControl<string | null>;
  contactTele?: FormControl<string | null>;
  notes?: FormControl<string | null>;

  //Required Document
  requiredDocumentList: FormArray<
    FormGroup<{
      item?: FormControl<string | null>;
      checked?: FormControl<boolean | null>;
    }>
  >;
  chAllDocuments: FormControl<boolean | null>;

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

  //Loss Adjuster
  lostadjuster?: FormControl<string | null>;
  lostadjusterEmail?: FormControl<string | null>; //Reference
  lostadjusterTele?: FormControl<string | null>;
  /* End Tap 1 */

  /***************        End Payment Tap     *****************/

  /* Medical */
  medical?: FormGroup<IClaimMedicalForm>;
  /***************        End Medical       *****************/

  /* Motor  */
  motor?: FormGroup<IClaimMotorForm>;
  /***************        End Motor       *****************/

  //   Claims General
  general?: FormGroup<IClaimGeneralForm>;
  /***************        End General       *****************/

  // Claim Payments
  totalPaymentsAmount?: FormControl<number | null>;
  totalApprovalsAmount?: FormControl<number | null>;
  totalInvoicesAmount?: FormControl<number | null>;

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

export interface IClaimAmountForm {
  ckClaimAmount?: FormControl<boolean | null>;
  claimAmount?: FormControl<number | null>;
  otherCurrAmount?: FormControl<number | null>;
  otherCurr?: FormControl<string | null>;
  exchangeRate?: FormControl<number | null>;
  estimatedValue?: FormControl<number | null>;
  salvage?: FormControl<number | null>;

  paid?: FormControl<number | null>;
  deducted?: FormControl<number | null>;
  rejected?: FormControl<number | null>;
  underProcessing?: FormControl<number | null>;
}

export interface IClaimMedicalForm {
  medID?: FormControl<string | null>;
  hospital?: FormControl<string | null>;
  medClass?: FormControl<string | null>; //Added M
  medCaseType?: FormControl<string | null>; //Added M
}

export interface IClaimMotorForm {
  carPaletNo?: FormControl<string | null>;
  mistakePercentage?: FormControl<number | null>;
  motorChassisNo?: FormControl<string | null>;
  type?: FormControl<string | null>; // Own Damage , Total Loss
  carsMake?: FormControl<string | null>;
  model?: FormControl<string | null>;
  typeOfrepair?: FormControl<string | null>;
  city?: FormControl<string | null>;
  workshopAgency?: FormControl<string | null>;
  accidentNumber?: FormControl<string | null>;
  TPL?: FormControl<number | null>;
  excess?: FormControl<number | null>;
  policyExcess?: FormControl<string | null>;
  policyCertificateNo?: FormControl<string | null>;
}

export interface IClaimGeneralForm {
  nameofInjured?: FormControl<string | null>;
  natureofLoss?: FormControl<string | null>;
  lossLocation?: FormControl<string | null>;
  claimExcess?: FormControl<string | null>;
  interimPayment?: FormControl<number | null>;
  recovery?: FormControl<string | null>;
  liability?: FormControl<string | null>;
  claimCertificateNo?: FormControl<string | null>;
  declarationNo?: FormControl<string | null>;
  shipmentName?: FormControl<string | null>;
  generalChassisNo?: FormControl<string | null>;
  claimsGeneral?: FormArray<FormGroup<IClaimsGeneralListForm>>;
}

export interface IClaimsGeneralListForm {
  claimNo?: FormControl<number | null>;
  clientName?: FormControl<string | null>;
  clientNo?: FormControl<number | null>;
  item?: FormControl<string | null>;
  mandatory?: FormControl<boolean | null>;
  value?: FormControl<number | null>;
}
