import { FormControl } from "@angular/forms"

export interface IComplaintSuspectiveCauses
{
    sno?: FormControl<number | null>,
    identity?: FormControl<string | null>
    suspectiveCause?: FormControl<string | null>

}
export interface IComplaintSuspectiveCausesData
{
    sno?: number,
    identity?: string
    suspectiveCause?: string,

}
