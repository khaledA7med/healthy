import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IDocumentReq } from "../../app/models/App/IDocumentReq";
import { IEditCommissionsFilter } from "../../app/models/Production/i-edit-commission-filter";
import { IEditCommissions } from "../../app/models/Production/i-edit-commissions";
import { IEditCommissionsFormData } from "../../app/models/Production/i-edit-commissions-forms";
import { IPolicy } from "../../app/models/Production/i-policy";
import { IChangePolicyStatusRequest } from "../../app/models/Production/i-policy-change-status-req";
import { IPolicyPreview } from "../../app/models/Production/ipolicy-preview";
import { IPolicyRenewalNoticeReportReq } from "../../app/models/Production/ipolicy-renewal-notice-report";
import { IPolicyRenewalReportReq } from "../../app/models/Production/ipolicy-renewal-report";
import { IProductionFilters } from "../../app/models/Production/iproduction-filters";
import { IDebitCreditNote } from "../../app/models/Production/iproduction-notes";
import { IdebitCreditNoteFilter } from "../../app/models/Production/iproduction-notes-filters";
import { productionReportReq } from "../../app/models/Production/iproduction-report";
import {
	DCNotesModel,
	IFilterByRequest,
	IPoliciesRef,
	IPolicyClient,
	IPolicyRequestResponse,
	IPolicyRequests,
} from "../../app/models/Production/production-util";
import { ApiRoutes } from "../../app/routers/ApiRoutes";

@Injectable({
	providedIn: "root",
})
export class ProductionService {
	private readonly env: string = environment.baseURL;
	constructor(private http: HttpClient) {}

	//#region  Form Services
	getAllPolicies(filters: IProductionFilters): Observable<HttpResponse<IBaseResponse<IPolicy[]>>> {
		return this.http.post<IBaseResponse<IPolicy[]>>(this.env + ApiRoutes.Production.search, filters, {
			observe: "response",
		});
	}

	searchClientByRequest(body: IFilterByRequest): Observable<IBaseResponse<IPolicyRequests[]>> {
		return this.http.post<IBaseResponse<IPolicyRequests[]>>(this.env + ApiRoutes.Production.clientByRequest, {
			clientName: body.clientName,
			periodFrom: new Date(body.dateFrom!),
			periodTo: new Date(body.dateTo!),
		});
	}

	searchForClient(body: any): Observable<IBaseResponse<IPolicyClient[]>> {
		return this.http.post<IBaseResponse<IPolicyClient[]>>(this.env + ApiRoutes.Production.searchClient, {
			sNo: +body.clientID,
			fullName: body.clientName,
		});
	}

	searchForPolicy(body: any): Observable<IBaseResponse<IPoliciesRef[]>> {
		return this.http.post<IBaseResponse<IPoliciesRef[]>>(this.env + ApiRoutes.Production.searchPolicies, {
			clientNo: body.clientID,
			clientName: body.clientName,
			status: body.status,
		});
	}

	fillRequestData(serial: string, policySNo: string): Observable<IBaseResponse<IPolicyRequestResponse>> {
		return this.http.post<IBaseResponse<IPolicyRequestResponse>>(this.env + ApiRoutes.Production.fillRequestData, {
			policySerial: serial,
			clientPolicySNo: policySNo,
		});
	}

	loadPolicyData(policySno: string, polRef: string): Observable<IBaseResponse<IPolicyPreview>> {
		return this.http.post<IBaseResponse<IPolicyPreview>>(
			this.env + ApiRoutes.Production.loadPolicyData,
			{},
			{ params: { PolicySNo: policySno, polRef } }
		);
	}

	savePolicy(body: FormData): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.Production.save, body, { observe: "response" });
	}

	getPolicy(id: string): Observable<HttpResponse<IBaseResponse<IPolicyPreview>>> {
		return this.http.get<IBaseResponse<IPolicyPreview>>(this.env + ApiRoutes.Production.edit, { params: { id }, observe: "response" });
	}

	checkEndorsNo(policy: string, endors: string): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(
			this.env + ApiRoutes.Production.checkEndorsNo,
			{},
			{
				params: { policyNo: policy, endorsNo: endors },
				observe: "response",
			}
		);
	}

	//#endregion

	getPolicyById(id: string): Observable<HttpResponse<IBaseResponse<IPolicyPreview>>> {
		return this.http.get<IBaseResponse<IPolicyPreview>>(this.env + ApiRoutes.Production.details, { params: { id }, observe: "response" });
	}

	changeStatus(data: IChangePolicyStatusRequest): Observable<HttpResponse<IBaseResponse<null>>> {
		return this.http.post<IBaseResponse<null>>(this.env + ApiRoutes.Production.changeStatus, data, {
			observe: "response",
		});
	}

	changeDeliveryStatus(data: { policyNo: string; deliveryStatus: string }): Observable<IBaseResponse<null>> {
		return this.http.post<IBaseResponse<null>>(this.env + ApiRoutes.Production.changeDeliveryStatus, { ...data });
	}

	downloadDocument(data: IDocumentReq): Observable<HttpResponse<any>> {
		return this.http.post(this.env + ApiRoutes.MasterMethods.downloadDocument, { path: data }, { observe: "response", responseType: "blob" });
	}

	deleteDocument(data: IDocumentReq): Observable<HttpResponse<IBaseResponse<null>>> {
		return this.http.post<IBaseResponse<null>>(this.env + ApiRoutes.MasterMethods.deleteDocument, { path: data }, { observe: "response" });
	}

	getEditCommission(filters: IEditCommissionsFilter): Observable<HttpResponse<IBaseResponse<IEditCommissions[]>>> {
		return this.http.post<IBaseResponse<IEditCommissions[]>>(this.env + ApiRoutes.Production.editCommissions, filters, {
			observe: "response",
		});
	}

	getUserData(id: string): Observable<HttpResponse<IBaseResponse<IEditCommissionsFormData>>> {
		return this.http.get<IBaseResponse<any>>(this.env + ApiRoutes.Production.editEditCommission, { params: { id }, observe: "response" });
	}

	UpdatePolicyComissions(data: FormData): Observable<HttpResponse<IBaseResponse<IEditCommissionsFormData>>> {
		return this.http.post<IBaseResponse<any>>(this.env + ApiRoutes.Production.updatePolicyCommission, data, { observe: "response" });
	}

	getLinesOFBusinessByClassNames(body: string[]): Observable<HttpResponse<IBaseResponse<string[]>>> {
		return this.http.post<IBaseResponse<string[]>>(this.env + ApiRoutes.MasterTable.Reports.lineOfBusinessByClassNames, body, {
			observe: "response",
		});
	}

	viewProductionReport(body: productionReportReq): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.Production.productionReport, body, {
			observe: "response",
		});
	}

	viewRenewalReport(body: IPolicyRenewalReportReq): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.Production.renewalReport, body, {
			observe: "response",
		});
	}

	viewRenewalNoticeReport(body: IPolicyRenewalNoticeReportReq): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.Production.renewalNoticeReports, body, {
			observe: "response",
		});
	}

	getAllArchiveNotes(filters: IdebitCreditNoteFilter): Observable<HttpResponse<IBaseResponse<IDebitCreditNote[]>>> {
		return this.http.post<IBaseResponse<IDebitCreditNote[]>>(this.env + ApiRoutes.Production.archiveReport, filters, {
			observe: "response",
		});
	}

	viewDebitCreditNoteReport(body: DCNotesModel): Observable<HttpResponse<IBaseResponse<string>>> {
		return this.http.post<IBaseResponse<string>>(this.env + ApiRoutes.Production.debitcreditNoteReport, body, {
			observe: "response",
		});
	}
}
