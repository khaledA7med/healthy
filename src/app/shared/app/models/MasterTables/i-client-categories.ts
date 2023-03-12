import { FormControl } from "@angular/forms"

export interface IClientCategories
{
    sno?: FormControl<number | null>,
    identity?: FormControl<string | null>
    category?: FormControl<string | null>

}
export interface IClientCategoriesData
{
    sno?: number,
    identity?: string
    category?: string,

}
