import { FormControl } from "@angular/forms";

export enum CustomerServiceStatus {
	Pending = "Pending",
	Close = "Closed",
	Cancel = "Canceled",
	NewRequest = "NewRequset",
}
export enum CustomerServiceStatusRes {
	Pending = "Pending",
	Closed = "Closed",
	Cancelled = "Canceled",
	NewRequest = "New Request",
}

export interface EndorsTypeByPolicy {
	id: string;
	name: string;
}

export interface RequiermentsList {
	itemCheck?: FormControl<Boolean | null>;
	itemValue?: FormControl<string | null>;
}
