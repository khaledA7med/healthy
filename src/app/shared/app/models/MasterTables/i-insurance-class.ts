import { FormControl } from "@angular/forms"

export interface IInsuranceClass
{
    sNo?: FormControl<number | null>,
    identity?: FormControl<string | null>
    className?: FormControl<string | null>,
    classNameAr?: FormControl<string | null>,
    abbreviation?: FormControl<string | null>,
    allowedToAccessInsuranceClasses?: FormControl<boolean | null>
}
export interface IInsuranceClassData
{
    sNo?: number,
    identity?: string
    className?: string,
    classNameAr?: string,
    abbreviation?: string,
    allowedToAccessInsuranceClasses?: boolean
}
