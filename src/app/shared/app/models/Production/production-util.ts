export enum searchBy {
	client = "Client",
	request = "Request",
}

export enum issueType {
	new = "new",
	renewal = "renewal",
	endorsement = "endorsement",
}

export enum IPolicyStatus {
	active = "Active",
	pending = "Pending",
	expired = "Expired",
	approvedByProduction = "Approved by Production",
	rejectedByProduction = "Rejected by Production",
	rejectedByFinance = "Rejected by Finance",
}

export interface IFilterByRequest {
	dateFrom?: string;
	dateTo?: string;
	clientName?: string;
}

export interface IPolicyRequests {
	requestNo?: string;
	endorsType?: string;
	policyNo?: string;
	clientID?: string;
	classOfBusiness?: string;
	lineOfBusiness?: string;
	status?: string;
	policySerial?: string;
	clientPolicySNo?: string;
	clieNetPremiumntPolicySNo?: string;
	vatPerc?: string;
	policyFees?: string;
	clientName?: string;
	producer?: string;
}

export interface IPolicyRequestResponse {
	clientPolicy: {
		accNo: string;
		policyNo: string;
		insurComp: string;
		className: string;
		lineOfBusiness: string;
		periodTo: string;
		compCommPerc: string;
		producerCommPerc: string;
	};
	clientData: {
		sNo: string;
		oasisPolRef: string;
		clientNo: string;
		clientName: string;
		producer: string;
		endorsType: string;
		endorsNo: string;
		issueDate: Date;
		minDriverAge: string;
		numberOfBeneficiaries: string;
		periodFrom: Date;
		claimNoOfDays: string;
		csNoOfDays: string;
		sumInsur: string;
		remarks: string;
	};
}

export interface IPolicyClient {
	sNo?: string;
	status?: string;
	fullName?: string;
	producer?: string;
}

export interface IPoliciesRef {
	sNo: string;
	insurComp: string;
	className: string;
	accNo: string;
	periodFrom: string;
	periodTo: string;
	policiesSNo: string;
	requestNo?: string;
	endorsType?: string;
	policyNo?: string;
	clientID?: string;
	classOfBusiness?: string;
	lineOfBusiness?: string;
	status?: string;
	policySerial?: string;
	clientPolicySNo?: string;
	clieNetPremiumntPolicySNo?: string;
	vatPerc?: string;
	policyFees?: string;
	clientName?: string;
	producer?: string;
}

export interface DCNotesModel {
	connectionType?: string | null;
	printedBy?: string | null;
	docSNo?: string | null;
	clientName?: string | null;
	type?: string | null;
	source?: string | null;
	plain?: boolean | null;
	userFullName?: string | null;
	pram?: number | null;
	reportType?: number | null;
}

export function refundChecker(params: any) {
	return params.data && (params.data.endorsType === "Refund" || params.data.endorsType === "Cancellation")
		? ["input-text-right", "text-danger"]
		: ["input-text-right"];
}
