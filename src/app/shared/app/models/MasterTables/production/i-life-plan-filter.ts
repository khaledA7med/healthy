export interface ILifePlanFilter {
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
