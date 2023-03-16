import { FormControl } from "@angular/forms";

export enum SalesLeadStatus {
	Prospect = "Prospect",
	Confirmed = "Confirmed",
	Quoting = "Quoting",
	PendingwithUnderwriting = "Pending with Underwriting",
	Lost = "Lost",
	WaitingForClientFeedback = "Waiting for Client Feedback",
}

export enum SalesLeadType {
	New = "New",
	Renewel = "Renewal",
}

export interface ISalesLeadFollowUpsForm {
	names?: FormControl<string[] | null>;
	msg?: FormControl<string | null>;
	no?: FormControl<string | null>;
}
export interface ISalesLeadFollowUpsReq {
	names?: string[] | null;
	msg?: string | null;
	no?: string | null;
}
