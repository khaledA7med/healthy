import { FormControl } from "@angular/forms"

export interface ITpaList
{
    sNo?: FormControl<number | null>,
    tpaName?: FormControl<string | null>

}
export interface ITpaListData
{
    sNo?: number,
    tpaName?: string,

}
