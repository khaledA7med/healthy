import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IBusinessDevelopment } from "../../app/models/BusinessDevelopment/ibusiness-development";
import { IBusinessDevelopmentFilters } from "../../app/models/BusinessDevelopment/ibusiness-development-filters";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { Caching, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { IChangeLeadStatusRequest } from "../../app/models/BusinessDevelopment/ibusiness-development-req";
import { ISalesLeadFollowUps } from "../../app/models/BusinessDevelopment/ibusiness-development-followups";
import { IRequirement } from "../../app/models/BusinessDevelopment/irequirement";
import { IBusinessDevelopmentProspectsReportReq } from "../../app/models/BusinessDevelopment/ibusiness-development-prospects-report";
import { IPolicyRenewalReportReq } from "../../app/models/Production/ipolicy-renewal-report";

@Injectable({
	providedIn: "root",
})
export class BusinessDevelopmentService {
	private readonly env = environment.baseURL;
	constructor(private http: HttpClient) {}

	getAllSalesLeads(filters: IBusinessDevelopmentFilters): Observable<HttpResponse<IBaseResponse<IBusinessDevelopment[]>>> {
		return this.http.post<IBaseResponse<IBusinessDevelopment[]>>(this.env + ApiRoutes.BusinessDevelopment.search, filters, {
			observe: "response",
		});
	}

	changeStatus(data: IChangeLeadStatusRequest): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post(this.env + ApiRoutes.BusinessDevelopment.changeStatus, data, { observe: "response" });
	}

	getFollowUps(leadNo: string): Observable<HttpResponse<IBaseResponse<ISalesLeadFollowUps[]>>> {
		return this.http.post<IBaseResponse<ISalesLeadFollowUps[]>>(
			this.env + ApiRoutes.BusinessDevelopment.followUp,
			{ leadNo },
			{
				observe: "response",
			}
		);
	}

	saveNote(data: {}): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post(this.env + ApiRoutes.BusinessDevelopment.saveNote, data, { observe: "response" });
	}

	lineOfBusiness(classOfInc: string): Observable<HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>> {
		return this.http.post(this.env + ApiRoutes.BusinessDevelopment.lineOfBusiness, {}, { params: { ClassName: classOfInc }, observe: "response" });
	}

	quotRequirements(data: {}): Observable<HttpResponse<IBaseResponse<IRequirement[]>>> {
		return this.http.post(this.env + ApiRoutes.BusinessDevelopment.quotingRequirements, data, { observe: "response" });
	}

	policyRequirements(data: {}): Observable<HttpResponse<IBaseResponse<IRequirement[]>>> {
		return this.http.post(this.env + ApiRoutes.BusinessDevelopment.policyRequirements, data, { observe: "response" });
	}

	saveSalesLead(body: FormData): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.BusinessDevelopment.save, body, {
			observe: "response",
		});
	}

	viewProspectsReport(body: IBusinessDevelopmentProspectsReportReq): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.BusinessDevelopment.prospectReport, body, {
			observe: "response",
		});
	}

	getSalesLeadById(id: string): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.get<IBaseResponse<any>>(this.env + ApiRoutes.BusinessDevelopment.edit, { params: { id }, observe: "response" });
	}
}
