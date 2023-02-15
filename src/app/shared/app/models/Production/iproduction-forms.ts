import { FormArray, FormControl, FormGroup } from "@angular/forms";
import {
  IPolicyCommissionListForms,
  IPolicyPaymentsListForms,
} from "./ipolicy-payments";

export interface IProductionForms {
  sNo?: FormControl<string | null>;
  searchType?: FormControl<string | null>;
  producer?: FormControl<string | null>;
  chPolicyHolder?: FormControl<boolean | null>;
  policyHolder?: FormControl<string | null>;
  requestNo?: FormControl<string | null>;
  clientInfo?: FormControl<string | null>;
  clientName?: FormControl<string | null>;
  clientNo?: FormControl<string | null>;
  oasisPolRef?: FormControl<string | null>;
  issueType?: FormControl<string | null>;
  paymentType?: FormControl<string | null>;
  accNo?: FormControl<string | null>;
  policyNo?: FormControl<string | null>;
  endorsType?: FormControl<string | null>;
  endorsNo?: FormControl<string | null>;
  insurComp?: FormControl<string | null>;
  className?: FormControl<string | null>;
  lineOfBusiness?: FormControl<string | null>;
  minDriverAge?: FormControl<number | null>;
  issueDate?: FormControl<string | null>;
  expiryDate?: FormControl<string | null>;
  claimNoOfDays?: FormControl<number | null>;
  csNoOfDays?: FormControl<number | null>;
  remarks?: FormControl<string | null>;
  clientDNCNNo?: FormControl<string | null>;
  compCommDNCNNo?: FormControl<string | null>;
  sumInsur?: FormControl<number | null>;
  netPremium?: FormControl<number | null>;
  fees?: FormControl<number | null>;
  deductFees?: FormControl<boolean | null>;
  vatPerc?: FormControl<number | null>;
  vatValue?: FormControl<number | null>;
  totalPremium?: FormControl<number | null>;
  compComm?: FormControl<number | null>;
  compCommPerc?: FormControl<number | null>;
  compCommVAT?: FormControl<number | null>;
  compCommAmount?: FormControl<number | null>;
  producerCommPerc?: FormControl<number | null>;
  producerComm?: FormControl<number | null>;
  branch?: FormControl<string | null>;
  renewal?: FormControl<string | null>;
  renewalOf?: FormControl<string | null>;
  endorsRequestType?: FormControl<string | null>;
  periodFrom?: FormControl<string | null>;
  periodTo?: FormControl<string | null>;
  paymentTermsList?: FormArray<FormGroup<IPolicyPaymentsListForms>>;
  producersCommissionsList?: FormArray<FormGroup<IPolicyCommissionListForms>>;
}
