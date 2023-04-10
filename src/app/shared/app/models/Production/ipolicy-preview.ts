import { IDocumentList } from "../App/IDocument";
import { IActivePolicyDetails } from "./i-active-policy-details";
import { IPolicy } from "./i-policy";
import { IPaymentTermsList } from "./ipayment-terms-list";
import { IProducersCommissionsList } from "./iproducers-commissions-list";

export interface IPolicyPreview extends IPolicy, IActivePolicyDetails {
	documents?: IDocumentList[];
	paymentTermsList?: IPaymentTermsList[];
	producersCommissionsList?: IProducersCommissionsList[];
	documentList?: IDocumentList[];
	documentLists?: IDocumentList[];
}
