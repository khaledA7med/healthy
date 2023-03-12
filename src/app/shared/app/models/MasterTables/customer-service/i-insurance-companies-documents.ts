import { FormControl } from "@angular/forms"

export interface IInsuranceCompaniesDocuments
{
    data?: FormControl<string | null>
    name?: FormControl<string | null>,
    size?: FormControl<string | null>,
    type?: FormControl<string | null>,
    contentDescription?: FormControl<string | null>
}
export interface IInsuranceCompaniesDocumentsData
{
    data?: string,
    name?: string
    size?: string,
    type?: string,
    contentDescription?: string,
}
