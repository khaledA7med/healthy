import { FormControl } from "@angular/forms"

export interface IClientRejectionReasons
{
    sNo?: FormControl<number | null>,
    identity?: FormControl<string | null>
    reason?: FormControl<string | null>

}
export interface IClientRejectionReasonsData
{
    sNo?: number,
    identity?: string
    reason?: string,

}