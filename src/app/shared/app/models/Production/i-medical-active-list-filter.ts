import { FormControl } from "@angular/forms";
import { IBaseFilters } from "../App/IBaseFilters";

export interface IMedicalActiveFiltersForm {
  status?: FormControl<string[] | null>;
  producer?: FormControl<string[] | string | null>;
  ourRef?: FormControl<string | null>;
  clientName?: FormControl<string | null>;
  insurCompany?: FormControl<string | null>;
  classOfInsurance?: FormControl<string | null>;
  lineOfBusiness?: FormControl<string | null>;
  policyNo?: FormControl<string | null>;
  createdBy?: FormControl<string | null>;
  inceptionFrom?: FormControl<Date | null>;
  inceptionTo?: FormControl<Date | null>;
  expiryFrom?: FormControl<Date | null>;
  expiryTo?: FormControl<Date | null>;
}
export interface IMedicalActiveFilters extends IBaseFilters {
  status?: string[] | null;
  producer?: string[] | string | null;
  ourRef?: string | null;
  insurCompany?: string | null;
  classOfInsurance?: string | null;
  lineOfBusiness?: string | null;
  policyNo?: string | null;
  createdBy?: string | null;
  inceptionFrom?: Date | null;
  inceptionTo?: Date | null;
  expiryFrom?: Date | null;
  expiryTo?: Date | null;
}
