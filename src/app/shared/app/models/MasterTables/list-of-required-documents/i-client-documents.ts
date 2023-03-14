import { FormControl } from "@angular/forms";

export interface IClientDocumentFilter {
	sNo?: number | null;
	docName?: string | null;
	identity?: string | null;
}

export interface IClientDocumentForm {
	sNo?: FormControl<number | null>;
	docName?: FormControl<string | null>;
	identity?: FormControl<string | null>;
}

export interface IClientDocumentReq {
	sNo?: number | null;
	docName?: string | null;
	identity?: string | null;
}
