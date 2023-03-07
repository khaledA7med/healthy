import { FormControl } from "@angular/forms"

export interface IPolicyTypes
{
    sno?: FormControl<number | null>,
    identity?: FormControl<string | null>
    policyType?: FormControl<string | null>

}
export interface IPolicyTypesData
{
    sno?: number,
    identity?: string
    policyType?: string,

}
