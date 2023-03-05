import { FormControl } from "@angular/forms";

export interface IContactList
{
    ClassOfBusiness?: FormControl<string | null>,
    LineOfBusiness?: FormControl<string | null>,
}