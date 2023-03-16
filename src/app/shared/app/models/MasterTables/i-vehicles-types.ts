import { FormControl } from "@angular/forms"

export interface IVehiclesTypes
{
    sNo?: FormControl<number | null>;
    identity?: FormControl<string | null>;
    vehicleType?: FormControl<string | null>;
    abbreviation?: FormControl<string | null>;

}
export interface IVehiclesTypesData
{
    sNo?: number,
    identity?: string,
    vehicleType?: string,
    abbreviation?: string,

}
