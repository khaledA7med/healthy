import { FormControl } from "@angular/forms";

export interface IAddProducers {
  policiesSNo?: FormControl<number | null>;
  polRef?: FormControl<number | null>;
  producer?: FormControl<string | null>;
  percentage?: FormControl<number | null>;
  amount?: FormControl<number | null>;
  savedBy?: FormControl<string | null>;
}

export interface IAddProducersData {
  policiesSNo?: number;
  polRef?: number;
  producer?: string;
  percentage?: number;
  amount?: number;
  savedBy?: string;
}
