import { ICompetitors } from "./icompetitors";
import { IQoutingRequirement } from "./iqoutingReq";
import { IClasses } from "./iclassses";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { IPolicyRequirement } from "./ipolicyReq";

export interface ISalesLeadForm {
  branch?: FormControl<string | null>;
  chClientResult?: FormControl<boolean | null>;
  chCurrentInsurer?: FormControl<boolean | null>;
  chDeadline?: FormControl<number | null>;
  chDeadlinebool?: FormControl<boolean | null>;
  chListRequirements?: FormControl<string | null>;
  chQuoatation?: FormControl<boolean | null>;
  chQuoatationSentToClient?: FormControl<boolean | null>;
  chRevisedQuoatation?: FormControl<boolean | null>;
  classOfBusiness?: FormControl<string | null>;
  // classesDD?:FormArray<FormGroup<IClasses>>
  clientID?: FormControl<number | null>;
  clientResultPremium?: FormControl<number | null>;
  currentBroker?: FormControl<string | null>;
  currentInsurer?: FormControl<string | null>;
  currentPolicyNo?: FormControl<string | null>;
  deadLine?: FormControl<string | null>;
  docSNo?: FormControl<number | null>;
  documentLists?: FormControl<string[] | null>;
  // documentsModel?:FormArray<FormGroup<>>
  estimatedPremium?: FormControl<number | null>;
  estimatedPremiumAED?: FormControl<number | null>;
  estimatedPremiumUSD?: FormControl<number | null>;
  exRateAED?: FormControl<number | null>;
  exRateUSD?: FormControl<number | null>;
  existingPolDetails?: FormControl<string | null>;
  existingPolExpDate?: FormControl<string | null>;
  insuranceCopmany?: FormControl<number | null>;
  isPolicyRequierments?: FormControl<boolean | null>;
  isQuotingRequierments?: FormControl<boolean | null>;
  leadType?: FormControl<string | null>;
  lineOfBusiness?: FormControl<string | null>;
  name?: FormControl<string | null>;
  policyDetails?: FormControl<string | null>;
  policyRequierments?: FormControl<string | null>;
  policyRequiermentsList?: FormControl<FormGroup<IPolicyRequirement>>;
  preferedInsurComapnies?: FormControl<string[] | null>;
  producer?: FormControl<string | null>;
  producerID?: FormControl<number | null>;
  quotingRequirementsList?: FormArray<FormGroup<IQoutingRequirement>>;
  sNo?: FormControl<number | null>;
  salesActivityLogChecked?: FormControl<boolean | null>;
  salesLeadCompetitorChecked?: FormControl<boolean | null>;
  salesLeadCompetitorsList?: FormArray<FormGroup<ICompetitors>>;
  selectedPolicyCompany?: FormControl<string | null>;
  selectedQuotingCompany?: FormControl<string | null>;
  sendToUW?: FormControl<Boolean | null>;
}
