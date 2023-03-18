import { FormControl } from "@angular/forms"

export interface IBankSettings
{
    sNo?: FormControl<number | null>;
    identity?: FormControl<string | null>;
    bankName?: FormControl<string | null>;
    swift?: FormControl<string | null>;

}
export interface IBankSettingsData
{
    sNo?: number,
    identity?: string,
    bankName?: string,
    swift?: string,

}
