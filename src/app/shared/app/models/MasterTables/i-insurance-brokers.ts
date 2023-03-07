import { FormControl } from "@angular/forms"

export interface IInsuranceBrokers
{
    sno?: FormControl<number | null>,
    identity?: FormControl<string | null>
    companyName?: FormControl<string | null>,
    mobileNo?: FormControl<string | null>,
    email?: FormControl<string | null>,
    address?: FormControl<string | null>
}
export interface IInsuranceBrokersData
{
    sno?: number,
    identity?: string
    companyName?: string,
    mobileNo?: string,
    email?: string,
    address?: string
}
