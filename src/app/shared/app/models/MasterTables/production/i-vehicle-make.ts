import { FormControl } from "@angular/forms";

export interface IVehicleMakeFilter {
	sNo?: number | null;
	make?: string | null;
	identity?: string | null;
}

export interface IVehicleMakeForm {
	sNo?: FormControl<number | null>;
	make?: FormControl<string | null>;
	identity?: FormControl<string | null>;
}

export interface IVehicleMakeReq {
	sNo?: number | null;
	make?: string | null;
	identity?: string | null;
}
