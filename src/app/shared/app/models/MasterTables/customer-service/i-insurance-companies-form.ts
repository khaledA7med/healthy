import { FormControl } from "@angular/forms"
import { IDocumentList } from "../../App/IDocument";

export interface IInsuranceCompaniesDocumentsForm
{
    company?: FormControl<string | null>
    type?: FormControl<string | null>,
    documents?: FormControl<IDocumentList[] | null>;
}
export interface IInsuranceCompaniesDocumentsFormData
{
    company?: string,
    type?: string,
    documents?: IDocumentList[];
}