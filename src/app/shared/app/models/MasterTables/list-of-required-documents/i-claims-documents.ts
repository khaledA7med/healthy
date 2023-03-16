import { FormControl } from "@angular/forms";

export interface IClaimsDocumentFilter {
	sNo?: number | null;
	docName?: string | null;
	classOfInsurance?: string | null;
	lineofBusiness?: string | null;
	identity?: string | null;
}

export interface IClaimsDocumentForm {
	sNo?: FormControl<number | null>;
	docName?: FormControl<string | null>;
	classOfInsurance?: FormControl<string | null>;
	lineofBusiness?: FormControl<string | null>;
	identity?: FormControl<string | null>;
}

export interface IClaimsDocumentReq {
	sNo?: number | null;
	docName?: string | null;
	classOfInsurance?: string | null;
	lineofBusiness?: string | null;
	identity?: string | null;
}
