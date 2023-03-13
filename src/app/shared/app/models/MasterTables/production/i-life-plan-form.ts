import { FormControl } from "@angular/forms";

export interface ILifePlanForm {
	sNo?: FormControl<number | null>;
	insuranceCompany?: FormControl<string | null>;
	planName?: FormControl<string | null>;
	paymentTerm?: FormControl<number | null>;
	compCommPerc?: FormControl<number | null>;
	overrideCommissionPerc?: FormControl<number | null>;
	producerCommPerc?: FormControl<number | null>;
	bdmAnagerCommPerc?: FormControl<number | null>;
	savedUser?: FormControl<string | null>;
	savedOn?: FormControl<Date | null>;
	updatedBy?: FormControl<string | null>;
	updatedOn?: FormControl<Date | null>;
	identity?: FormControl<string | null>;
}

export interface ILifePlanReq {
	sNo?: number | null;
	insuranceCompany?: string | null;
	planName?: string | null;
	paymentTerm?: number | null;
	compCommPerc?: number | null;
	overrideCommissionPerc?: number | null;
	producerCommPerc?: number | null;
	bdmAnagerCommPerc?: number | null;
	savedUser?: string | null;
	savedOn?: Date | null;
	updatedBy?: string | null;
	updatedOn?: Date | null;
	identity?: string | null;
}
