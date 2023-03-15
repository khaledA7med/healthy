import { FormControl } from "@angular/forms"

export interface IClaimsRejectionReasons
{
    sno?: FormControl<number | null>;
    type?: FormControl<string | null>;
    rejectionReason?: FormControl<string | null>;
}
export interface IClaimsRejectionReasonsData
{
    sno?: number,
    type?: string,
    rejectionReason?: string,
}
