import { FormControl } from "@angular/forms"

export interface IPolicyIssuanceRequirements
{
    sNo?: FormControl<number | null>,
    identity?: FormControl<string | null>
    type?: FormControl<string | null>
    defaultTick?: FormControl<number | null>
    class?: FormControl<string | null>
    lineOfBusiness?: FormControl<string | null>
    insuranceCopmany?: FormControl<string | null>
    item?: FormControl<string | null>
    itemArabic?: FormControl<string | null>
    description?: FormControl<string | null>
    descriptionArabic?: FormControl<string | null>
}
export interface IPolicyIssuanceRequirementsData
{
    sNo?: number,
    identity?: string
    type?: string,
    defaultTick?: number,
    class?: string,
    lineOfBusiness?: string,
    insuranceCopmany?: string,
    item?: string,
    itemArabic?: string,
    description?: string,
    descriptionArabic?: string,

}
export interface IPolicyIssuanceRequirementsFilter
{

    sNo?: number | null,
    identity?: string | null,
    type?: string | null,
    defaultTick?: number | null,
    class?: string | null,
    lineOfBusiness?: string | null,
    insuranceCopmany?: string | null,
    item?: string | null,
    itemArabic?: string | null,
    description?: string | null,
    descriptionArabic?: string | null,


}