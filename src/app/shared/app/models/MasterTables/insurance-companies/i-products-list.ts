import { FormControl } from "@angular/forms";

export interface IProductsList {
  sNo?: FormControl<number | null>;
  insurCompSNo?: FormControl<number | null>;
  classOfBusiness?: FormControl<string | null>;
  lineOfBusiness?: FormControl<string | null>;
  savedBy?: FormControl<string | null>;
  savedOn?: FormControl<string | null>;
}

export interface IProductsListData {
  sNo?: number;
  insurCompSNo?: number;
  classOfBusiness?: string;
  lineOfBusiness?: string;
  savedBy?: string;
  savedOn?: string;
}
