export interface IActivePolicy {
	sNo?: number;
	policiesSNo?: number;
	status?: string;
	oasisPolRef?: string;
	clientNo?: number;
	clientName?: string;
	producer?: string;
	insurComp?: string;
	className?: string;
	lineOfBusiness?: string;
	policyNo?: string;
	issueDate?: Date;
	periodFrom?: Date;
	periodTo?: Date;
	producerCommPerc?: number;
	compCommPerc?: number;
	cancelled?: number;
	savedBy?: string;
	savedOn?: Date;
	identity?: string;
}
