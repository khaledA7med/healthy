import { FormControl } from "@angular/forms";

export interface IPoliciesDocumentFilter {
	sNo?: number | null;
	docName?: string | null;
	policyIssueType?: string | null;
	identity?: string | null;
}

export interface IPoliciesDocumentForm {
	sNo?: FormControl<number | null>;
	docName?: FormControl<string | null>;
	policyIssueType?: FormControl<string | null>;
	identity?: FormControl<string | null>;
}

export interface IPoliciesDocumentReq {
	sNo?: number | null;
	docName?: string | null;
	policyIssueType?: string | null;
	identity?: string | null;
}
