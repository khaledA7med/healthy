import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { IAddProducers } from "./i-add-producers";

export interface IEditCommissionsForm {
  sNo?: FormControl<number | null>;
  clientNo?: FormControl<number | null>;
  clientName?: FormControl<string | null>;
  accNo?: FormControl<string | null>;
  policyNo?: FormControl<string | null>;
  savedBy?: FormControl<string | null>;
  className?: FormControl<string | null>;
  lineOfBusiness?: FormControl<string | null>;
  compCommPerc?: FormControl<string | null>;
  producerCommPerc?: FormControl<string | null>;
  periodFrom?: FormControl<Date | null>;
  producer?: FormControl<string | null>;
  periodTo?: FormControl<Date | null>;
  updatedBy?: FormControl<string | null>;
  insurComp?: FormControl<string | null>;
  producersCommissions?: FormArray<FormGroup<IAddProducers>>;
}

export interface IEditCommissionsFormData {
  sNo?: number;
  clientNo?: number;
  clientName?: string;
  accNo?: string;
  policyNo?: string;
  savedBy?: string;
  className?: string;
  lineOfBusiness?: string;
  compCommPerc?: string;
  producerCommPerc?: string;
  periodFrom?: Date;
  periodTo?: Date;
  producer?: string;
  updatedBy?: string;
  insurComp?: string;
  // producersCommissions?: string[];
  policiesSNo?: number;
  polRef?: number;
  percentage?: number;
  amount?: number;
}
