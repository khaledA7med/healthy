import { FormControl } from '@angular/forms';

export interface IAddCompanyRequirements
{
    sno?: FormControl<number | null>;
    endorsType?: FormControl<string | null>;
    classofInsurance?: FormControl<string | null>;
    insuranceCompanyID?: FormControl<number | null>;
    lineOfBusiness?: FormControl<string | null>;
    insuranceCompanyName?: FormControl<string | null>;
    item?: FormControl<string | null>;
    oldItem?: FormControl<string | null>;
    userName?: FormControl<string | null>;
}
export interface IAddCompanyRequirementsData
{
    sno?: number | null;
    endorsType?: string | null;
    classofInsurance?: string | null;
    insuranceCompanyID?: number | null;
    lineOfBusiness?: string | null;
    insuranceCompanyName?: string | null;
    item?: string | null;
    oldItem?: string | null;
    userName?: string | null;
}