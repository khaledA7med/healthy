import { FormControl } from "@angular/forms";

export interface IVehicleTypeFilter {
	sNo?: number | null;
	make?: string | null;
	type?: string | null;
	identity?: string | null;
}

export interface IVehicleTypeForm {
	sNo?: FormControl<number | null>;
	make?: FormControl<string | null>;
	type?: FormControl<string | null>;
	identity?: FormControl<string | null>;
}

export interface IVehicleTypeReq {
	sNo?: number | null;
	make?: string | null;
	type?: string | null;
	identity?: string | null;
}
