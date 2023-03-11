import { FormControl } from "@angular/forms"

export interface ILocations
{
    sno?: FormControl<number | null>,
    identity?: FormControl<string | null>
    locationName?: FormControl<string | null>

}
export interface ILocationsData
{
    sno?: number,
    identity?: string
    locationName?: string,

}
