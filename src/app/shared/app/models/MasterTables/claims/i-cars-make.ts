import { FormControl } from "@angular/forms"

export interface ICarsMake
{
    sno?: FormControl<number | null>,
    carsMake?: FormControl<string | null>

}
export interface ICarsMakeData
{
    sno?: number,
    carsMake?: string,

}
