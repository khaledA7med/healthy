import { FormControl } from "@angular/forms"

export interface IContactsListPosition
{
    sNo?: FormControl<number | null>;
    identity?: FormControl<string | null>;
    position?: FormControl<string | null>;

}
export interface IContactsListPositionData
{
    sNo?: number,
    identity?: string,
    position?: string,

}
