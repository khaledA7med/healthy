import { FormControl } from "@angular/forms"

export interface ILegalStatus
{
    sno?: FormControl<number | null>,
    identity?: FormControl<string | null>
    legalStatus?: FormControl<string | null>

}
export interface ILegalStatusData
{
    sno?: number,
    identity?: string
    legalStatus?: string,

}
