import { FormControl } from "@angular/forms";
import { IBaseFilters } from "../App/IBaseFilters";

export interface IMedicalActiveFiltersForm {
  status?: FormControl<string | null>;
}
export interface IMedicalActiveFilters extends IBaseFilters {
  status?: string | null;
}
