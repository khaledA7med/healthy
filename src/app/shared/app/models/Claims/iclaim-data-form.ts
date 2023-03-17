import { IGenericResponseType } from "src/app/core/models/masterTableModels";
import { IDocumentList } from "../App/IDocument";
import { IClaimApproval } from "./iclaim-approval-form";
import { IClaimInvoice } from "./iclaim-invoice-form";
import { IClaimPayment } from "./iclaim-payment-form";
import { IClaimRejectDeduct } from "./iclaim-reject-deduct-form";
import { IClaims } from "./iclaims";

export interface IClaimDataForm extends IClaims {
  rejectionReasons?: string;
  rejectType?: string;
  prevClaims?: string;
  totalRejectedAmount?: number;
  totalDedectedAmount?: number;
  paid?: number;
  lossLessInceptionConfirm?: boolean;
  lossGreaterExpiryConfirm?: boolean;
  totals?: string;
  claimsRejections?: IClaimRejectDeduct[];
  claimInvoices?: IClaimInvoice[];
  claimApprovals?: IClaimApproval[];
  paymentsList?: IClaimPayment[];
  totalStatus?: [];
  emailsLog?: [];
  documentsInfo?: [];
  cNo?: number;
  policiesSNo?: number;
  lineOfBusiness?: string;
  dateOfLossFrom?: Date;
  dateOfLossTo?: Date;
  projectTitle?: string;
  maintenancePeriodFrom: null;
  maintenancePeriodTo: null;
  previousClaimsNo?: number;
  claimTransactions?: [];
  insuredClaimNo?: "";
  blawbNo?: string;
  claimantMobile?: string;
  claimantEmail?: string;
  claimantIBAN?: string;
  bankName?: string;
  bankBranch?: string;
  bankCity?: string;
  otherCurrAmount?: number;
  otherCurr?: string;
  salvage?: number;
  contactName?: string;
  contactEmail?: string;
  contactTele?: string;
  requiredDocumentList?: IGenericResponseType[];
  requiredDocuments?: string;
  chIntimationDate?: boolean;
  intimationDate?: Date;
  chDateOfLoss?: boolean;
  chDateOfReceive?: boolean;
  chDateofSubmission?: boolean;
  chDateOfDeadline?: boolean;
  lostadjuster?: string;
  lostadjusterEmail?: string;
  lostadjusterTele?: string;
  documentList?: IDocumentList[];
  medID?: string;
  hospital?: string;
  medClass?: string;
  medCaseType?: string;
  carPaletNo?: string;
  mistakePercentage?: number;
  claimType?: string;
  type?: string;
  carsMake?: string;
  typeOfrepair?: string;
  city?: string;
  workshopAgency?: string;
  accidentNumber?: string;
  tpl?: number;
  excess?: number;
  policyExcess?: string;
  nameofInjured?: string;
  natureofLoss?: string;
  lossLocation?: string;
  claimExcess?: number;
  interimPayment?: number;
  recovery?: string;
  liability?: string;
  claimCertificateNo?: string;
  declarationNo?: string;
  claimsGeneral: [];
  generalChassisNo?: string;
  motorChassisNo?: string;
  insuranceCompanyDNCNNo?: string;
  driverAge?: string;
  approvedAmount?: number;
  deductible?: number;
  policyIdentity?: string;
}
