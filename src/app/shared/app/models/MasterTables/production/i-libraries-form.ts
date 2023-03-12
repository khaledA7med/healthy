import { FormControl } from "@angular/forms";

export interface ILibrariesForm {
	sNo?: FormControl<number | null>;
	type?: FormControl<string | null>;
	defaultTick?: FormControl<number | null>;
	class?: FormControl<string | null>;
	lineOfBusiness?: FormControl<string | null>;
	insuranceCopmany?: FormControl<string | null>;
	item?: FormControl<string | null>;
	itemArabic?: FormControl<string | null>;
	description?: FormControl<string | null>;
	descriptionArabic?: FormControl<string | null>;
	identity?: FormControl<string | null>;
}

export interface ILibrariesReq {
	sNo?: number | null;
	type?: string | null;
	defaultTick?: number | null;
	class?: string | null;
	lineOfBusiness?: string | null;
	insuranceCopmany?: string | null;
	item?: string | null;
	itemArabic?: string | null;
	description?: string | null;
	descriptionArabic?: string | null;
	identity?: string | null;
}
