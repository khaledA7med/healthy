import { FormControl } from "@angular/forms"

export interface ICancellationReasons
{
    sno?: FormControl<number | null>,
    cancelReason?: FormControl<string | null>

}
export interface ICancellationReasonsData
{
    sno?: number,
    cancelReason?: string,

}