import { IProducersCommissionsList } from "./iproducers-commissions-list";

export interface IChangePolicyStatusRequest {
	status?: string;
	sno?: number;
	done?: number;
	reject?: number;
	endorsType?: string;
	sumInsur?: number;
	netPremium?: number;
	vatValue?: number;
	fees?: number;
	totalPremium?: number;
	compComm?: number;
	compCommVat?: number;
	producerComm?: number;
	mgrAprovedUser?: string;
	prodRejectInfo?: string;
	prodRejecType?: string;
	savedUser?: string;
	policyNo?: string;
	clientName?: string;
	className?: string;
	issueDate?: Date;
	periodTo?: Date;
	producersCommissionsList?: IProducersCommissionsList[];
}
