import { FormControl } from "@angular/forms"

export interface IClaimsStatus
{
    sNo?: FormControl<number | null>;
    status?: FormControl<string | null>;
    claimNotes?: FormControl<string | null>;
    abb?: FormControl<string | null>;
}
export interface IClaimsStatusData
{
    sNo?: number,
    status?: string,
    claimNotes?: string,
    abb?: string,
}
