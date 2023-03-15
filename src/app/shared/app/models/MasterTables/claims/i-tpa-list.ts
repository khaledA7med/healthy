import { FormControl } from "@angular/forms"

export interface ITpaList
{
    sno?: FormControl<number | null>,
    tpaName?: FormControl<string | null>

}
export interface ITpaListData
{
    sno?: number,
    tpaName?: string,

}
