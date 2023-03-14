import { FormControl } from "@angular/forms"

export interface ICarsMake
{
    sNo?: FormControl<number | null>,
    carsMake?: FormControl<string | null>

}
export interface ICarsMakeData
{
    sNo?: number,
    carsMake?: string,

}
