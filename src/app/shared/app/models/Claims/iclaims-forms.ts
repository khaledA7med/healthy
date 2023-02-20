import { FormControl } from "@angular/forms";

export interface IClaimsForms {
  SNo?: FormControl<number | null>;
  Branch?: FormControl<string | null>;
  CNo?: FormControl<string | null>;
  ClaimNo?: FormControl<string | null>;
  PoliciesSNo?: FormControl<string | null>;

  /* Policy Details Tap */
  ClientID?: FormControl<string | null>;
  ClientName?: FormControl<string | null>;
  InsuranceCompany?: FormControl<string | null>;
  PolicyNo?: FormControl<string | null>;
  ClassName?: FormControl<string | null>;
  LineOfBusiness?: FormControl<string | null>;
  DateOfLossFrom?: FormControl<Date | null>; //Inception Date
  DateOfLossTo?: FormControl<Date | null>; //Expiry Date
  ProjectTitle?: FormControl<string | null>;
  MaintenancePeriodFrom?: FormControl<Date | null>;
  MaintenancePeriodTo?: FormControl<Date | null>;
  PreviousClaimsNo?: FormControl<number | null>;
  //  IEnumerable<ClaimTransactionDto> ClaimTransactions  = new List<ClaimTransactionDto>(); // Just For Presentation
  /****************** End ************************/

  /* Payment Tap 1- Claim Details */
  InsurCompClaimNo?: FormControl<string | null>;
  InsuredClaimNo?: FormControl<string | null>;
  MembName?: FormControl<string | null>;
  BLAWBNo?: FormControl<string | null>;

  //Claimant Details
  ClaimantMobile?: FormControl<string | null>;
  ClaimantEmail?: FormControl<string | null>;
  ClaimantIBAN?: FormControl<string | null>;
  BankName?: FormControl<string | null>;
  BankBranch?: FormControl<string | null>;
  BankCity?: FormControl<string | null>;

  //Claim Amount
  ClaimAmount?: FormControl<number | null>;
  OtherCurrAmount?: FormControl<number | null>;
  OtherCurr?: FormControl<string | null>;
  EstimatedValue?: FormControl<number | null>;
  Salvage?: FormControl<number | null>;

  //Contact Details
  ContactName?: FormControl<string | null>;
  ContactEmail?: FormControl<string | null>;
  ContactTele?: FormControl<string | null>;
  Notes?: FormControl<string | null>;

  //Required Document
  //  IEnumerable<BaseLookUpDto> requiredDocumentList  = new List<BaseLookUpDto>();
  //   RequiredDocuments

  //claim Details Dates
  ChIntimationDate?: FormControl<boolean | null>;
  IntimationDate?: FormControl<Date | null>;

  ChDateOfLoss?: FormControl<boolean | null>;
  DateOfLoss?: FormControl<Date | null>; //Accident / Bill Date

  ChDateOfReceive?: FormControl<boolean | null>;
  DateOfReceive?: FormControl<Date | null>; //Receive Date

  ChDateofSubmission?: FormControl<boolean | null>;
  DateOfSubmission?: FormControl<Date | null>;

  ChDateOfDeadline?: FormControl<boolean | null>;
  DateOfDeadline?: FormControl<Date | null>;

  Status?: FormControl<string | null>;
  ClaimStatusNotes?: FormControl<string | null>;
  //  IEnumerable<BaseLookUpDto> ClaimStatusNotesList  = new List<BaseLookUpDto>();

  //Loss Adjuster
  Lostadjuster?: FormControl<string | null>;
  LostadjusterEmail?: FormControl<string | null>; //Reference
  LostadjusterTele?: FormControl<string | null>;
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
  MedID?: FormControl<string | null>;
  Hospital?: FormControl<string | null>;
  MedClass?: FormControl<string | null>; //Added M
  MedCaseType?: FormControl<string | null>; //Added M
  /***************        End Medical       *****************/

  /* Motor  */
  CarPaletNo?: FormControl<string | null>;
  MistakePercentage?: FormControl<number | null>;
  ClaimType?: FormControl<string | null>; //MOT GEN
  Type?: FormControl<string | null>; // Own Damage , Total Loss
  CarsMake?: FormControl<string | null>;
  Model?: FormControl<string | null>;
  TypeOfrepair?: FormControl<string | null>;
  City?: FormControl<string | null>;
  WorkshopAgency?: FormControl<string | null>;
  //  IEnumerable<BaseLookUpDto> WorkshopAgencyList  = new List<BaseLookUpDto>();
  AccidentNumber?: FormControl<string | null>;
  TPL?: FormControl<number | null>;
  Excess?: FormControl<number | null>;
  PolicyExcess?: FormControl<string | null>;
  PolicyCertificateNo?: FormControl<string | null>;

  /***************        End Motor       *****************/

  /* General  */
  NameofInjured?: FormControl<string | null>;
  NatureofLoss?: FormControl<string | null>;
  LossLocation?: FormControl<string | null>;
  ClaimExcess?: FormControl<number | null>;
  InterimPayment?: FormControl<number | null>;
  Recovery?: FormControl<string | null>;
  Liability?: FormControl<string | null>;
  ClaimCertificateNo?: FormControl<string | null>;
  DeclarationNo?: FormControl<string | null>;
  ShipmentName?: FormControl<string | null>;
  //  IEnumerable<ClaimGeneralDto> ClaimsGeneral  = new List<ClaimGeneralDto>();
  //   ClaimsGeneral

  /***************        End General       *****************/

  /********* Matual ************/
  GeneralChassisNo?: FormControl<string | null>;
  MotorChassisNo?: FormControl<string | null>;
  ChassisNumber?: FormControl<string | null>;

  /*********************/

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
