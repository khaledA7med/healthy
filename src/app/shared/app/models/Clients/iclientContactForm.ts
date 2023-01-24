import { FormControl } from "@angular/forms";

export interface IClientContact {
    sNo?: FormControl<number | null>,
    branch?: FormControl<string | null>,
    clientID?: FormControl<number | null>,
    contactName?: FormControl<string | null>,
    mobile?: FormControl<string | null>,
    lineOfBusiness?: FormControl<string | null>,
    department?: FormControl<string | null>,
    extension?: FormControl<string | null>,
    position?: FormControl<string | null>,
    mainContact?: FormControl<number | null>,
    tele?: FormControl<string | null>,
    email?: FormControl<string | null>,
    dateofBirth?: FormControl<Date | null>,
    savedUser?: FormControl<string | null>,
    address?: FormControl<string | null>
}