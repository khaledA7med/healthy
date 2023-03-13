import { FormControl } from '@angular/forms';
export interface ICompanyRequirements
{
    sno?: FormControl<number | null>;
    item?: FormControl<string | null>;
}
export interface Data
{
    sno?: number;
    item?: string
}