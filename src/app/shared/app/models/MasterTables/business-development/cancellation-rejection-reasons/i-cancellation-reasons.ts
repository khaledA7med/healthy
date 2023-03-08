import { FormControl } from "@angular/forms"

export interface ICancellationReasons
{
    sNo?: FormControl<number | null>,
    identity?: FormControl<string | null>
    reason?: FormControl<string | null>

}
export interface ICancellationReasonsData
{
    sNo?: number,
    identity?: string
    reason?: string,

}