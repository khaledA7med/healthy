import { FormControl } from "@angular/forms"

export interface IInsuranceWorkshopDetails
{
    sNo?: FormControl<number | null>;
    insuranceCompany?: FormControl<string | null>;
    workshopName?: FormControl<string | null>;
    city?: FormControl<string | null>;
    address?: FormControl<string | null>;
    telephone?: FormControl<string | null>;
    email?: FormControl<string | null>;
}
export interface IInsuranceWorkshopDetailsData
{
    sNo?: number,
    insuranceCompany?: string,
    workshopName?: string,
    city?: string,
    address?: string,
    telephone?: string,
    email?: string,
}
