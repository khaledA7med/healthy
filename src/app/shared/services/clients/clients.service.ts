import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IClientForms } from "../../app/models/Clients/iclientForms";
import { IClient } from "../../app/models/Clients/iclient";
import { IClientFilters } from "../../app/models/Clients/iclientFilters";
import { ApiRoutes } from "../../app/routers/ApiRoutes";

@Injectable({
	providedIn: "root",
})
export class ClientsService {
	private readonly env = environment.baseURL;
	constructor(private http: HttpClient) {}

	getAllClients(clientFilters: IClientFilters): Observable<HttpResponse<IBaseResponse<IClient[]>>> {
		return this.http.post(this.env + ApiRoutes.Clients.search, clientFilters, {
			observe: "response",
		});
	}
}
