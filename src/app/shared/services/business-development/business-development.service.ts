import { IClientPreview } from "./../../app/models/Clients/iclient-preview";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IBusineeDevelopment } from "../../app/models/BusinessDevelopment/ibusineeDevelopment";
import { IBusinessDevelopmentFilters } from "../../app/models/BusinessDevelopment/ibusinessDevelopmentFilters";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { IChangeStatusRequest } from "../../app/models/Clients/iclientStatusReq";

@Injectable({
	providedIn: "root",
})
export class BusinessDevelopmentService {
	private readonly env = environment.baseURL;
	constructor(private http: HttpClient) {}

	getAllSalesLeads(businessDevelopmentFilters: IBusinessDevelopmentFilters): Observable<HttpResponse<IBaseResponse<IBusineeDevelopment[]>>> {
		return this.http.post<IBaseResponse<IBusineeDevelopment[]>>(this.env + ApiRoutes.BusinessDevelopment.search, businessDevelopmentFilters, {
			observe: "response",
		});
	}

	// getClintDetails(sno: number): Observable<HttpResponse<IBaseResponse<IClientPreview>>> {
	// 	return this.http.get<IBaseResponse<IClientPreview>>(this.env + ApiRoutes.Clients.details, {
	// 		observe: "response",
	// 		params: { sno },
	// 	});
	// }

	// getClientById(id: string): Observable<HttpResponse<IBaseResponse<IClientPreview>>> {
	// 	return this.http.get<IBaseResponse<IClientPreview>>(this.env + ApiRoutes.Clients.edit, { params: { id }, observe: "response" });
	// }

	// saveClient(body: FormData): Observable<HttpResponse<IBaseResponse<number>>> {
	// 	return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.Clients.save, body, {
	// 		observe: "response",
	// 	});
	// }

	// changeStatus(data: IChangeStatusRequest): Observable<HttpResponse<IBaseResponse<null>>> {
	// 	return this.http.post<IBaseResponse<null>>(this.env + ApiRoutes.Clients.changeStatus, data, {
	// 		observe: "response",
	// 	});
	// }

	// deleteDocument(data: string): Observable<HttpResponse<IBaseResponse<null>>> {
	// 	return this.http.post<IBaseResponse<null>>(this.env + ApiRoutes.Clients.deleteDocument, { path: data }, { observe: "response" });
	// }
	// downloadDocument(data: string): Observable<HttpResponse<any>> {
	// 	return this.http.post(this.env + ApiRoutes.Clients.downloadDocument, { path: data }, { observe: "response", responseType: "blob" });
	// }
}
