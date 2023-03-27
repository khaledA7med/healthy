import { FormControl } from "@angular/forms";

export interface IClaimsGeneralItems {
  sno?: FormControl<number | null>;
  item?: FormControl<string | null>;
  classOfInsurance?: FormControl<string | null>;
  lineofBusiness?: FormControl<string | null>;
  mandatory?: FormControl<number | null>;
}
export interface IClaimsGeneralItemsData {
  sno?: number;
  item?: string;
  classOfInsurance?: string;
  lineofBusiness?: string;
  mandatory?: number;
}
