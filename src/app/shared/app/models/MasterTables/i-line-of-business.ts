import { FormControl } from "@angular/forms"

export interface ILineOfBusiness
{
    sNo?: FormControl<number | null>,
    identity?: FormControl<string | null>
    className?: FormControl<string | null>,
    lineofBusiness?: FormControl<string | null>,
    lineofBusinessAr?: FormControl<string | null>,
    abbreviation?: FormControl<string | null>,
}
export interface ILineOfBusinessData
{
    sNo?: number,
    identity?: string
    className?: string,
    lineofBusiness?: string,
    lineofBusinessAr?: string,
    abbreviation?: string,
}
