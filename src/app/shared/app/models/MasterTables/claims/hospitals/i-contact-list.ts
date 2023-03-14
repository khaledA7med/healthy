import { FormControl } from "@angular/forms";

export interface IContactList
{
    SNo?: FormControl<number | null>;
    HospitalId?: FormControl<number | null>;
    Name?: FormControl<string | null>;
    Position?: FormControl<string | null>;
    Email?: FormControl<string | null>;
    Phone?: FormControl<string | null>;
    SavedUser?: FormControl<string | null>;

}