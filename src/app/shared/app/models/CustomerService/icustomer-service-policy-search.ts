export interface ICustomerServicePolicySearch {
	sNo?: number;
	policiesSNo?: number;
	clientNo?: number;
	clientName?: string;
	policyHolder?: string;
	producer?: string;
	insurComp?: string;
	className?: string;
	lineOfBusiness?: string;
	policyNo?: string;
	periodFrom?: Date;
	periodTo?: Date;
	cancelled?: number;
	csSpecialConditions?: string;
}
