import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface IMotorDataForm {
  policiesSNo?: FormControl<number | null>;
  data?: FormArray<FormGroup<MotorDataForm>>;
}
export interface IMotorData {
  data: MotorData[] | [];
  policiesSNo: number;
}

export interface MotorDataForm {
  sNo?: FormControl<number | null>;
  oasisPolRef?: FormControl<string | null>;
  policiesSNo?: FormControl<number | null>;
  policyNo?: FormControl<string | null>;
  clientID?: FormControl<number | null>;
  ownerDriver?: FormControl<string | null>;
  plateNo?: FormControl<string | null>;
  plateChar1?: FormControl<string | null>;
  plateChar2?: FormControl<string | null>;
  plateChar3?: FormControl<string | null>;
  sequenceNo?: FormControl<string | null>;
  customID?: FormControl<string | null>;
  brandName?: FormControl<string | null>;
  model?: FormControl<string | null>;
  inception?: FormControl<Date | null>;
  expiry?: FormControl<Date | null>;
  kclDate?: FormControl<Date | null>;
  seats?: FormControl<string | null>;
  chassisNo?: FormControl<string | null>;
  marketValue?: FormControl<string | null>;
  bodyType?: FormControl<string | null>;
  repairType?: FormControl<string | null>;
  vehicleOwnerID?: FormControl<string | null>;
  projectName?: FormControl<string | null>;
  savedUser?: FormControl<string | null>;
  savedOn?: FormControl<Date | null>;
}

export interface MotorData {
  sNo?: number | null;
  oasisPolRef?: string | null;
  policiesSNo?: number | null;
  policyNo?: string | null;
  clientID?: number | null;
  ownerDriver?: string | null;
  plateNo?: string | null;
  plateChar1?: string | null;
  plateChar2?: string | null;
  plateChar3?: string | null;
  sequenceNo?: string | null;
  customID?: string | null;
  brandName?: string | null;
  model?: string | null;
  inception?: Date | null;
  expiry?: Date | null;
  kclDate?: Date | null;
  seats?: string | null;
  chassisNo?: string | null;
  marketValue?: string | null;
  bodyType?: string | null;
  repairType?: string | null;
  vehicleOwnerID?: string | null;
  projectName?: string | null;
  savedUser?: string | null;
  savedOn?: Date | null;
}
