import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IClient } from "../../app/models/Clients/iclient";
import { IClientGroups } from "../../app/models/Clients/iclientgroups";
import { ApiRoutes } from "../../app/routers/ApiRoutes";

@Injectable({
	providedIn: "root",
})
export class ClientsGroupsService {
	private readonly env = environment.baseURL;
	constructor(private http: HttpClient) {}
	getAllGroups(): Observable<HttpResponse<IBaseResponse<IClientGroups[]>>> {
		return this.http.post(
			this.env + ApiRoutes.ClientsGroups.list,
			{},
			{
				observe: "response",
			}
		);
	}
	getAllClients(): Observable<HttpResponse<IBaseResponse<IClient[]>>> {
		return this.http.get(this.env + ApiRoutes.LookUpTables.allActiveClients, {
			observe: "response",
		});
	}
	createGroup(groupName: string): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post(
			this.env + ApiRoutes.ClientsGroups.create,
			{ groupName },
			{
				observe: "response",
			}
		);
	}
	deleteGroup(id: number, groupName: string): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.get(this.env + ApiRoutes.ClientsGroups.delete + `?id=${id}`, {
			observe: "response",
			params: { id, groupName },
		});
	}
	getGroupClients(groupName: string): Observable<HttpResponse<IBaseResponse<IClient[]>>> {
		return this.http.post(
			this.env + ApiRoutes.ClientsGroups.listGroupClients,
			{ groupName },
			{
				observe: "response",
			}
		);
	}
	addClient(clientID: number, groupName: string): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post(
			this.env + ApiRoutes.ClientsGroups.addClient,
			{ clientID, groupName },
			{
				observe: "response",
			}
		);
	}
	deleteClient(clientID: number): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.get(this.env + ApiRoutes.ClientsGroups.deleteClient + `?clientSno=${clientID}`, {
			observe: "response",
		});
	}
}
