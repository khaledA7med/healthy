import { IClaimsFollowUp } from "./../../app/models/Claims/iclaims-followUp";
import { IBaseFilters } from "./../../app/models/App/IBaseFilters";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IClaimsFilter } from "../../app/models/Claims/iclaims-filter";
import { IClaims } from "../../app/models/Claims/iclaims";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { IClaimPolicies, IClaimPoliciesSearch, IClaimsNoteReport } from "../../app/models/Claims/claims-util";
import { IGenericResponseType } from "src/app/core/models/masterTableModels";
import { IClaimDataForm } from "../../app/models/Claims/iclaim-data-form";
import { IEmailResponse } from "../../app/models/Email/email-response";
import { IClaimPayment } from "../../app/models/Claims/iclaim-payment-form";
import { IClaimApproval } from "../../app/models/Claims/iclaim-approval-form";
import { IClaimInvoice } from "../../app/models/Claims/iclaim-invoice-form";
import { IClaimRejectDeduct } from "../../app/models/Claims/iclaim-reject-deduct-form";
import { claimsReportReq } from "../../app/models/Claims/iclaims-report";

@Injectable({
	providedIn: "root",
})
export class ClaimsService {
	private readonly env = environment.baseURL;
	constructor(private http: HttpClient) {}
	getAllClaims(claimsFilters: IClaimsFilter | IBaseFilters): Observable<HttpResponse<IBaseResponse<IClaims[]>>> {
		return this.http.post<IBaseResponse<IClaims[]>>(this.env + ApiRoutes.Claims.search, claimsFilters, {
			observe: "response",
		});
	}

	//#region Forms Section
	searchPolicy(filter: IClaimPoliciesSearch): Observable<HttpResponse<IBaseResponse<IClaimPolicies[]>>> {
		return this.http.post<IBaseResponse<IClaimPolicies[]>>(
			this.env + ApiRoutes.Claims.searchPolicy,
			{
				PageNumber: filter.pageNumber,
				PageSize: filter.pageSize,
				orderBy: filter.orderBy,
				orderDir: filter.orderDir,
				ClientName: filter.clientName ?? "",
				PolicyNo: filter.policyNo ?? "",
				insuranceCompany: filter.insuranceCompany ?? "",
				ClassOfInsurance: filter.classOfInsurance ?? "",
				LineOfBusiness: filter.lineOfBusiness ?? "",
			},
			{ observe: "response" }
		);
	}

	searchClientClaimData(data: IClaimPolicies): Observable<IBaseResponse<IClaimPolicies>> {
		return this.http.post<IBaseResponse<IClaimPolicies>>(this.env + ApiRoutes.Claims.SearchClientClaimData, {
			ClassOfBusiness: data.className,
			LineOfBusiness: data.lineOfBusiness,
			PolicyNo: data.policyNo,
			ClientId: data.clientNo?.toString(),
		});
	}

	getClaimStatusNotes(state: string[]): Observable<IBaseResponse<IGenericResponseType[]>> {
		return this.http.post<IBaseResponse<IGenericResponseType[]>>(this.env + ApiRoutes.Claims.getClaimStatusNotes, {
			status: state,
		});
	}

	saveClaim(data: FormData): Observable<IBaseResponse<number>> {
		return this.http.post<IBaseResponse<any>>(this.env + ApiRoutes.Claims.saveClaim, data);
	}

	getClaimById(id: string): Observable<HttpResponse<IBaseResponse<IClaimDataForm>>> {
		return this.http.get<IBaseResponse<IClaimDataForm>>(this.env + ApiRoutes.Claims.editClaim, { params: { id }, observe: "response" });
	}

	saveClaimPayment(data: FormData): Observable<IBaseResponse<IClaimPayment[]>> {
		return this.http.post<IBaseResponse<IClaimPayment[]>>(this.env + ApiRoutes.Claims.saveClaimPayment, data);
	}

	approveClaimPayment(data: IClaimPayment): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<IClaimPayment>>(this.env + ApiRoutes.Claims.approvePayment, {
			sNo: data.sNo,
			approved: data.approved,
			rejected: data.reject,
			amount: data.amount,
			paymentDetails: data.paymentDetails,
			paymentType: data.paymentType,
			bankName: data.bankName,
			iban: data.iban,
			dateofPayment: data.dateofCheque,
			dateofCheque: data.dateofCheque,
		});
	}

	getInsurerWorkshops(insurComp: string, city: string): Observable<IBaseResponse<any>> {
		return this.http.post(this.env + ApiRoutes.Claims.getInsurerWorkshops, {
			insuranceCompany: insurComp,
			city: city,
		});
	}

	rejectClaimPayment(id: number): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(this.env + ApiRoutes.Claims.rejectPayment, {}, { params: { sno: id } });
	}

	saveClaimApproval(formData: FormData): Observable<IBaseResponse<IClaimApproval[]>> {
		return this.http.post<IBaseResponse<IClaimApproval[]>>(this.env + ApiRoutes.Claims.saveClaimApproval, formData);
	}

	saveClaimInvoice(formData: FormData): Observable<IBaseResponse<IClaimInvoice[]>> {
		return this.http.post<IBaseResponse<IClaimInvoice[]>>(this.env + ApiRoutes.Claims.saveClaimInvoice, formData);
	}

	saveClaimRejectDeduct(formData: FormData): Observable<IBaseResponse<IClaimRejectDeduct[]>> {
		return this.http.post<IBaseResponse<IClaimRejectDeduct[]>>(this.env + ApiRoutes.Claims.saveClaimRejectDeduct, formData);
	}

	deleteClaimRejections(id: number): Observable<IBaseResponse<number>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.Claims.deleteClaimRejectDeduct, {}, { params: { sno: id } });
	}

	//#endregion

	getSubStatus(status: string[]): Observable<HttpResponse<IBaseResponse<string[]>>> {
		return this.http.post<IBaseResponse<string[]>>(this.env + ApiRoutes.Claims.subStatus, { status: status }, { observe: "response" });
	}

	getFollowUp(sNo: number): Observable<HttpResponse<IBaseResponse<IClaimsFollowUp[]>>> {
		return this.http.post<IBaseResponse<IClaimsFollowUp[]>>(
			this.env + ApiRoutes.Claims.followUps,
			{},
			{ observe: "response", params: { ClaimSno: sNo } }
		);
	}
	saveFollowUp(email: { no: string; msg: string; names: string[] }): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.Claims.saveFollowUps, email, { observe: "response" });
	}

	getClientMailData(data: {}): Observable<HttpResponse<IBaseResponse<IEmailResponse>>> {
		return this.http.post<IBaseResponse<IEmailResponse>>(this.env + ApiRoutes.Claims.getClientMailData, data, { observe: "response" });
	}
	getInsurerMailData(data: {}): Observable<HttpResponse<IBaseResponse<IEmailResponse>>> {
		return this.http.post<IBaseResponse<IEmailResponse>>(this.env + ApiRoutes.Claims.getInsurerMailData, data, { observe: "response" });
	}

	getLinesOFBusinessByClassNames(body: string[]): Observable<HttpResponse<IBaseResponse<string[]>>> {
		return this.http.post<IBaseResponse<string[]>>(this.env + ApiRoutes.MasterTable.Reports.lineOfBusinessByClassNames, body, {
			observe: "response",
		});
	}

	viewCSReport(body: claimsReportReq): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.Claims.claimsReport, body, {
			observe: "response",
		});
	}
	viewArchiveNoteReport(body: IClaimsNoteReport): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.Claims.archiveReport, body, {
			observe: "response",
		});
	}
}
