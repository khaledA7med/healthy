import { FormControl } from "@angular/forms";

export interface IProductsList
{
    ContactName?: FormControl<string | null>,
    ContactPosition?: FormControl<string | null>,
    ContactEmail?: FormControl<string | null>,
    ContactMobileNo?: FormControl<string | null>,
    ContactTele?: FormControl<string | null>,
    Address?: FormControl<string | null>,
    Department?: FormControl<string | null>,
    LineOfBusiness?: FormControl<string | null>,
}