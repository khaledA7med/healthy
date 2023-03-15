import { FormArray, FormControl, FormGroup } from "@angular/forms"
import { IContactList } from "./i-contact-list";
import { INetworkList } from "./i-network-list";

export interface IHospitals
{
    sno?: FormControl<number | null>;
    name?: FormControl<string | null>;
    city?: FormControl<string | null>;
    address?: FormControl<string | null>;
    email?: FormControl<string | null>;
    tele?: FormControl<string | null>;
    fax?: FormControl<string | null>;
    specialties?: FormControl<string | null>;
    region?: FormControl<string | null>;
    contactList?: FormArray<FormGroup<IContactList>>;
    networkList?: FormArray<FormGroup<INetworkList>>;
}
export interface IHospitalsData
{
    sno?: number,
    name?: string,
    city?: string,
    address?: string,
    email?: string,
    tele?: string,
    fax?: string,
    specialties?: string,
    region?: string,
    contactList?: string[],
    networkList?: string[]
}