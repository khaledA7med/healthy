import { FormControl } from "@angular/forms";
import { IBaseFilters } from "../App/IBaseFilters";

export interface IUsersFiltersForm {
  status?: FormControl<string | null>;
  userType?: FormControl<string | null>;
  clientName?: FormControl<string | null>;
}
export interface IUsersFilters extends IBaseFilters {
  status?: string | null;
  userType?: string | null;
  clientName?: string | null;
}
