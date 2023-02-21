import { FormControl } from "@angular/forms";

export interface IClientReportFilters 
{
    status?: FormControl<string[] | null>,
    name?: FormControl<string | null>,
    accountNumber?: FormControl<string | null>,
    crNO?: FormControl<string | null>,
    producer?: FormControl<string | null>,
    type?: FormControl<string | null>,
    branchs?: FormControl<string[] | null>,
    minDate?: FormControl<Date | null>,
    maxDate?: FormControl<Date | null>
}