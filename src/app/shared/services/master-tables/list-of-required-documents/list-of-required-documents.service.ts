import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { IClientDocumentFilter, IClientDocumentReq } from "src/app/shared/app/models/MasterTables/list-of-required-documents/i-client-documents";
import { IClaimsDocumentFilter, IClaimsDocumentReq } from "src/app/shared/app/models/MasterTables/list-of-required-documents/i-claims-documents";
import {
	IPoliciesDocumentFilter,
	IPoliciesDocumentReq,
} from "src/app/shared/app/models/MasterTables/list-of-required-documents/i-production-documents";

@Injectable({
	providedIn: "root",
})
export class ListOfRequiredDocumentsService {
	constructor(private http: HttpClient) {}
	private readonly env = environment.baseURL;

	//#region Clients Documents Functions
	getClientsDocuments(): Observable<HttpResponse<IBaseResponse<IClientDocumentFilter[]>>> {
		return this.http.post<IBaseResponse<IClientDocumentFilter[]>>(
			this.env + ApiRoutes.masterTables.listOfDocuments.clients.search,
			{},
			{ observe: "response" }
		);
	}

	saveClientsDocuments(data: IClientDocumentReq): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(this.env + ApiRoutes.masterTables.listOfDocuments.clients.save, { ...data });
	}

	editClientsDocuments(id: string): Observable<IBaseResponse<IClientDocumentReq>> {
		return this.http.get<IBaseResponse<IClientDocumentReq>>(this.env + ApiRoutes.masterTables.listOfDocuments.clients.edit, {
			params: { id },
		});
	}

	deleteClientsDocuments(id: string): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(
			this.env + ApiRoutes.masterTables.listOfDocuments.clients.delete,
			{},
			{
				params: { id },
			}
		);
	}
	//#endregion

	//#region Claims Documents Functions
	getClaimsDocuments(data: { insurClass: string; lineOfBusiness: string }): Observable<HttpResponse<IBaseResponse<IClaimsDocumentFilter[]>>> {
		return this.http.post<IBaseResponse<IClaimsDocumentFilter[]>>(
			this.env + ApiRoutes.masterTables.listOfDocuments.claims.search,
			{ ...data },
			{ observe: "response" }
		);
	}

	saveClaimsDocuments(data: IClaimsDocumentReq): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(this.env + ApiRoutes.masterTables.listOfDocuments.claims.save, { ...data });
	}

	editClaimsDocuments(id: string): Observable<IBaseResponse<IClaimsDocumentReq>> {
		return this.http.get<IBaseResponse<IClaimsDocumentReq>>(this.env + ApiRoutes.masterTables.listOfDocuments.claims.edit, {
			params: { id },
		});
	}

	deleteClaimsDocuments(id: string): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(
			this.env + ApiRoutes.masterTables.listOfDocuments.claims.delete,
			{},
			{
				params: { id },
			}
		);
	}
	//#endregion

	//#region Policies Documents Functions
	getPoliciesDocuments(PolicyIssueType: string): Observable<HttpResponse<IBaseResponse<IPoliciesDocumentFilter[]>>> {
		return this.http.post<IBaseResponse<IPoliciesDocumentFilter[]>>(
			this.env + ApiRoutes.masterTables.listOfDocuments.production.search,
			{},
			{ params: { PolicyIssueType }, observe: "response" }
		);
	}

	savePoliciesDocuments(data: IPoliciesDocumentReq): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(this.env + ApiRoutes.masterTables.listOfDocuments.production.save, { ...data });
	}

	editPoliciesDocuments(id: string): Observable<IBaseResponse<IPoliciesDocumentReq>> {
		return this.http.get<IBaseResponse<IPoliciesDocumentReq>>(this.env + ApiRoutes.masterTables.listOfDocuments.production.edit, {
			params: { id },
		});
	}

	deletePoliciesDocuments(id: string): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(
			this.env + ApiRoutes.masterTables.listOfDocuments.production.delete,
			{},
			{
				params: { id },
			}
		);
	}
	//#endregion
}
