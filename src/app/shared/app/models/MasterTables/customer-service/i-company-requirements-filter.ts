import { FormControl } from "@angular/forms";

export interface ICompanyRequirementsFilter
{
    endorsType?: string;
    classofInsurance?: string;
    insuranceCompanyID?: number;
    lineOfBusiness?: string;
    insuranceCompanyName?: string;
}