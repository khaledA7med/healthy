import { FormControl } from "@angular/forms"

export interface INationalties
{
    sno?: FormControl<number | null>,
    identity?: FormControl<string | null>
    nationality?: FormControl<string | null>

}
export interface INationaltiesData
{
    sno?: number,
    identity?: string
    nationality?: string,

}
