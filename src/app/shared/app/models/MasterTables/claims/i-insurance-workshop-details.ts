import { FormControl } from "@angular/forms";

export interface IInsuranceWorkshopDetailsFilter {
  sno?: number | null;
  identity?: string | null;
  insuranceCompany?: string | null;
  workshopName?: string | null;
  city?: string | null;
  address?: string | null;
  telephone?: string | null;
  email?: string | null;
}

export interface IInsuranceWorkshopDetails {
  sno?: FormControl<number | null>;
  identity?: FormControl<string | null>;
  insuranceCompany?: FormControl<string | null>;
  workshopName?: FormControl<string | null>;
  city?: FormControl<string | null>;
  address?: FormControl<string | null>;
  telephone?: FormControl<string | null>;
  email?: FormControl<string | null>;
}
export interface IInsuranceWorkshopDetailsData {
  sno?: number | null;
  identity?: string | null;
  insuranceCompany?: string | null;
  workshopName?: string | null;
  city?: string | null;
  address?: string | null;
  telephone?: string | null;
  email?: string | null;
}
