import { FormControl } from "@angular/forms"

export interface IProspectLossReasons
{
    sNo?: FormControl<number | null>,
    identity?: FormControl<string | null>
    reason?: FormControl<string | null>

}
export interface IProspectLossReasonsData
{
    sNo?: number,
    identity?: string
    reason?: string,

}