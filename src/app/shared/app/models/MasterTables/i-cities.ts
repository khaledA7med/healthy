import { FormControl } from "@angular/forms"

export interface ICities
{
    sNo?: FormControl<number | null>;
    identity?: FormControl<string | null>;
    city?: FormControl<string | null>;

}
export interface ICitiesData
{
    sNo?: number,
    identity?: string,
    city?: string,

}
