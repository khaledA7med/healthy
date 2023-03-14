import { FormControl } from "@angular/forms";

export interface IVehicleColorFilter {
	sNo?: number | null;
	color?: string | null;
	identity?: string | null;
}

export interface IVehicleColorForm {
	sNo?: FormControl<number | null>;
	color?: FormControl<string | null>;
	identity?: FormControl<string | null>;
}

export interface IVehicleColorReq {
	sNo?: number | null;
	color?: string | null;
	identity?: string | null;
}
