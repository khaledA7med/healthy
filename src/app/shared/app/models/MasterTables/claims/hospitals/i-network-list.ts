import { FormControl } from "@angular/forms";

export interface INetworkList {
  sNo?: FormControl<number | null>;
  hospitalId?: FormControl<number | null>;
  hospitalName?: FormControl<string | null>;
  insurCompany?: FormControl<string | null>;
  classVvip?: FormControl<string | null>;
  classVip?: FormControl<string | null>;
  classAp?: FormControl<string | null>;
  classA?: FormControl<string | null>;
  classAm?: FormControl<string | null>;
  classBp?: FormControl<string | null>;
  classB?: FormControl<string | null>;
  classBm?: FormControl<string | null>;
  classCp?: FormControl<string | null>;
  classC?: FormControl<string | null>;
  classCm?: FormControl<string | null>;
  classCa?: FormControl<string | null>;
  classCae?: FormControl<string | null>;
  classCD?: FormControl<string | null>;
  classE?: FormControl<string | null>;
  savedUser?: FormControl<string | null>;
}
export interface INetworkListData {
  sNo?: number;
  hospitalId?: number;
  hospitalName?: string;
  insurCompany?: string;
  classVvip?: string;
  classVip?: string;
  classAp?: string;
  classA?: string;
  classAm?: string;
  classBp?: string;
  classB?: string;
  classBm?: string;
  classCp?: string;
  classC?: string;
  classCm?: string;
  classCa?: string;
  classCae?: string;
  classCD?: string;
  classE?: string;
  savedUser?: string;
}
