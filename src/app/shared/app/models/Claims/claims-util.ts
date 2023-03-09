import { IGenericResponseType } from "src/app/core/models/masterTableModels";
import { IBaseFilters } from "../App/IBaseFilters";

export enum ClaimsType {
	Medical = "Medical",
	Motor = "Motor",
	General = "General",
}

export interface IClaimPoliciesSearch extends IBaseFilters {
	clientName?: string | null;
	policyNo?: string | null;
	insuranceCompany?: string | null;
	classOfInsurance?: string | null;
	lineOfBusiness?: string | null;
}

export interface IClaimPolicies {
	sNo?: number;
	clientName?: string;
	insurComp?: string;
	className?: string;
	lineOfBusiness?: string;
	policyNo?: string;
	remarks?: string;
	sumInsur?: number;
	periodFrom?: string;
	periodTo?: string;
	clientNo?: string;
	oasisPolRef?: string;
	maintenancePeriodMonths?: string;
	identity?: string;
	claimTransactionList?: IClaimTransactionList[];
	requiredDocumentList?: IGenericResponseType[];
	claimGeneralList?: IClaimGeneralList[];
	previousClaimsCount?: number;
}

export interface IClaimTransactionList {
	accNo?: string;
	subAccName?: string;
	policyNo?: string;
	outstandingBalance?: string;
	overDueBalance?: string;
}
export interface IClaimGeneralList {
	claimNo?: string;
	clientName?: string;
	clientNo?: string;
	item?: string;
	mandatory?: boolean;
	value?: number;
}

export interface IClaimsNoteReport {
	claimNo: string | null;
	claimPaymentSno: number | null;
	clientID: number | null;
	policyNo: string | null;
	paymentAmount: number | null;
}

export enum claimsStatus {
	active = "Active",
	closed = "Closed",
	pending = "Pending",
	rejected = "Rejected",
	canceled = "Canceled",
}
