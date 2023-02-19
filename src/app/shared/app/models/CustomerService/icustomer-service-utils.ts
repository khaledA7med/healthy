import { FormControl } from "@angular/forms";

export enum CustomerServiceStatus {
	Pending = "Pending",
	Close = "Closed",
	Cancel = "Canceled",
	NewRequest = "NewRequset",
}

export interface EndorsTypeByPolicy {
	id: string;
	name: string;
}

export interface RequiermentsList {
	itemCheck?: FormControl<Boolean | null>;
	itemValue?: FormControl<string | null>;
	// itemValue?: string;
}
