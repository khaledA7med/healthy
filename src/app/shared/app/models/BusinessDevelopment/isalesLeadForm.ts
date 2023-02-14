import { IActivityLog } from "./iactivity-log";
import { ICompetitors } from "./icompetitors";
import { IRequirement } from "./irequirement";
import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface ISalesLeadForm {
  // lead details
  leadType?: FormControl<string | null>;
  clientID?: FormControl<number | null>;
  name?: FormControl<string | null>;
  producer?: FormControl<string | null>;

  // insurance details
  classOfBusiness?: FormControl<string | null>;
  lineOfBusiness?: FormControl<string | null>;
  estimatedPremium?: FormControl<number | null>;
  deadLine?: FormControl<Date | null>;
  chDeadline?: FormControl<number | null>;
  chDeadlinebool?: FormControl<boolean | null>;
  preferedInsurComapnies?: FormControl<string[] | null>;
  policyDetails?: FormControl<string | null>;

  // currently insured
  existingPolExpDate?: FormControl<string | null>;
  currentPolicyNo?: FormControl<string | null>;
  currentBroker?: FormControl<string | null>;
  currentInsurer?: FormControl<string | null>;
  existingPolDetails?: FormControl<string | null>;
  // requirements
  quotingRequirementsList?: FormArray<FormGroup<IRequirement>>;
  policyRequiermentsList?: FormArray<FormGroup<IRequirement>>;
  companyNameQuot?: FormControl<string | null>; // for check Requirements
  companyNamePol?: FormControl<string | null>; // for check Requirements

  // lead activity
  salesActivityLogChecked?: FormControl<boolean | null>;
  salesActivityLogList?: FormArray<FormGroup<IActivityLog>>;
  salesLeadCompetitorChecked?: FormControl<boolean | null>;
  salesLeadCompetitorsList?: FormArray<FormGroup<ICompetitors>>;
  // others
  branch?: FormControl<string | null>;
  sendToUW?: FormControl<Boolean | null>;

  // for edit
  sNo?: FormControl<number | null>;
  leadNo?: FormControl<string | null>;

  chClientResult?: FormControl<boolean | null>;
  chCurrentInsurer?: FormControl<boolean | null>;
  chListRequirements?: FormControl<string | null>;
  chQuoatation?: FormControl<boolean | null>;
  chQuoatationSentToClient?: FormControl<boolean | null>;
  chRevisedQuoatation?: FormControl<boolean | null>;
  clientResultPremium?: FormControl<number | null>;
  docSNo?: FormControl<number | null>;
  documentLists?: FormControl<string[] | null>;
  estimatedPremiumAED?: FormControl<number | null>;
  estimatedPremiumUSD?: FormControl<number | null>;
  exRateAED?: FormControl<number | null>;
  exRateUSD?: FormControl<number | null>;
  insuranceCopmany?: FormControl<number | null>;
  isPolicyRequierments?: FormControl<boolean | null>;
  isQuotingRequierments?: FormControl<boolean | null>;
  policyRequierments?: FormControl<string | null>;
  producerID?: FormControl<number | null>;

  selectedPolicyCompany?: FormControl<string | null>;
  selectedQuotingCompany?: FormControl<string | null>;
}
