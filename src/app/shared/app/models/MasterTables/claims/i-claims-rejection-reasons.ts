import { FormControl } from "@angular/forms"

export interface IClaimsRejectionReasons
{
    sNo?: FormControl<number | null>;
    type?: FormControl<string | null>;
    rejectionReason?: FormControl<string | null>;
}
export interface IClaimsRejectionReasonsData
{
    sNo?: number,
    type?: string,
    rejectionReason?: string,
}
