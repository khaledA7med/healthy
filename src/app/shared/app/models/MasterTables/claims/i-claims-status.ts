import { FormArray, FormControl, FormGroup } from "@angular/forms"

export interface IClaimsStatus
{
    sno?: FormControl<number | null>;
    status?: FormControl<string | null>;
    claimNotes?: FormControl<string | null>;
    abb?: FormControl<string | null>;
}
export interface IClaimsStatusData
{
    sno?: number,
    status?: string,
    claimNotes?: string,
    abb?: string,
}
