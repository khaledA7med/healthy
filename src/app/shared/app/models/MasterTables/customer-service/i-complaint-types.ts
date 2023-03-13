import { FormControl } from "@angular/forms"

export interface IComplaintTypes
{
    sno?: FormControl<number | null>,
    identity?: FormControl<string | null>
    type?: FormControl<string | null>

}
export interface IComplaintTypesData
{
    sno?: number,
    identity?: string
    type?: string,

}
