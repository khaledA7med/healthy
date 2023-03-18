import { FormControl } from "@angular/forms";

export interface ICompanyRequirementsFilterData
{
    endorsType?: FormControl<string | null>;
    classofInsurance?: FormControl<string | null>;
    insuranceCompanyID?: FormControl<number | null>;
    lineOfBusiness?: FormControl<string | null>;
    insuranceCompanyName?: FormControl<string | null>;
}
export interface ICompanyRequirementsFilter
{
    endorsType?: string;
    classofInsurance?: string;
    insuranceCompanyID?: number;
    lineOfBusiness?: string;
    insuranceCompanyName?: string;
}