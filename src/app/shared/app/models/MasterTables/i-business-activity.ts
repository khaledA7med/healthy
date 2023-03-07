import { FormControl } from "@angular/forms"

export interface IBusinessActivity
{
    sno?: FormControl<number | null>,
    identity?: FormControl<string | null>
    businessActivity?: FormControl<string | null>

}
export interface IBusinessActivityData
{
    sno?: number,
    identity?: string
    businessActivity?: string,

}
