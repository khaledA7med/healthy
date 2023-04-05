import { FormControl } from "@angular/forms";

export interface IMedicalData {
    SNo?: Number | null;
    OasisPolRef?: string | null;
    PoliciesSNo?: Number | null;
    PolicyNo?: string | null;
    ClientID?: Number | null;
    Valid?: string | null;
    IdIqamaNo?: string | null;
    MembershipNo?: string | null;
    MemberName?: string | null;
    DOB?: string | null;
    Relation?: string | null;
    MaritalStatus?: string | null;
    Gender?: string | null;
    SponsorNo?: string | null;
    EndtNo?: string | null;
    Class?: string | null;
    City?: string | null;
    StaffNo?: string | null;
    Premium?: string | null;
    MobileNo?: string | null;
    Nationality?: string | null;
    CCHIStatus?: string | null;
    SavedUser?: string | null;
    SavedDate?: string | null;
}

export interface IMedicalFormData {
    SNo?: FormControl<Number | null>;
    OasisPolRef?: FormControl<string | null>;
    PoliciesSNo?: FormControl<Number | null>;
    PolicyNo?: FormControl<string | null>;
    ClientID?: FormControl<Number | null>;
    Valid?: FormControl<string | null>;
    IdIqamaNo?: FormControl<string | null>;
    MembershipNo?: FormControl<string | null>;
    MemberName?: FormControl<string | null>;
    DOB?: FormControl<string | null>;
    Relation?: FormControl<string | null>;
    MaritalStatus?: FormControl<string | null>;
    Gender?: FormControl<string | null>;
    SponsorNo?: FormControl<string | null>;
    EndtNo?: FormControl<string | null>;
    Class?: FormControl<string | null>;
    City?: FormControl<string | null>;
    StaffNo?: FormControl<string | null>;
    Premium?: FormControl<string | null>;
    MobileNo?: FormControl<string | null>;
    Nationality?: FormControl<string | null>;
    CCHIStatus?: FormControl<string | null>;
    SavedUser?: FormControl<string | null>;
    SavedDate?: FormControl<string | null>;
}