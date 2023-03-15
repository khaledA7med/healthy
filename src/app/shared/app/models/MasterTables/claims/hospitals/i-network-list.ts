import { FormControl } from "@angular/forms";

export interface INetworkList
{
    sNo?: FormControl<number | null>;
    HospitalId?: FormControl<number | null>;
    HospitalName?: FormControl<string | null>;
    InsurCompany?: FormControl<string | null>;
    ClassVvip?: FormControl<string | null>;
    ClassVip?: FormControl<string | null>;
    ClassAp?: FormControl<string | null>;
    ClassA?: FormControl<string | null>;
    ClassAm?: FormControl<string | null>;
    ClassBp?: FormControl<string | null>;
    ClassB?: FormControl<string | null>;
    ClassBm?: FormControl<string | null>;
    ClassCp?: FormControl<string | null>;
    ClassC?: FormControl<string | null>;
    ClassCm?: FormControl<string | null>;
    ClassCa?: FormControl<string | null>;
    ClassCae?: FormControl<string | null>;
    ClassCD?: FormControl<string | null>;
    ClassE?: FormControl<string | null>;
    SavedUser?: FormControl<string | null>;
}