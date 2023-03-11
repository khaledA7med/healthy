import { FormControl } from "@angular/forms"

export interface ICompanyRejectionReasons
{
    sNo?: FormControl<number | null>,
    identity?: FormControl<string | null>
    reason?: FormControl<string | null>

}
export interface ICompanyRejectionReasonsData
{
    sNo?: number,
    identity?: string
    reason?: string,

}