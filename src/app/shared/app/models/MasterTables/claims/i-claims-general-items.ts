import { FormControl } from "@angular/forms"

export interface IClaimsGeneralItems
{
    sNo?: FormControl<number | null>;
    item?: FormControl<string | null>;
    classOfInsurance?: FormControl<string | null>;
    lineofBusiness?: FormControl<string | null>;
    mandatory?: FormControl<string | null>;
}
export interface IClaimsGeneralItemsData
{
    sNo?: number,
    item?: string,
    classOfInsurance?: string,
    lineofBusiness?: string,
    mandatory?: string,
}
