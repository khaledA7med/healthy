import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { IEmailClient, IEmailClientContact, IClientContact } from "../../app/models/Email/email-utils";

@Injectable({
	providedIn: "root",
})
export class EmailService {
	private readonly env = environment.baseURL;

	constructor(private http: HttpClient) {}

	getAllActiveClients(clientFilters: { sNo: number; fullName: string }): Observable<HttpResponse<IBaseResponse<IEmailClient[]>>> {
		return this.http.post<IBaseResponse<IEmailClient[]>>(this.env + ApiRoutes.Emails.allActiveClients, clientFilters, {
			observe: "response",
		});
	}

	getAllClientContacts(clientId: number): Observable<HttpResponse<IBaseResponse<IEmailClientContact[]>>> {
		return this.http.post<IBaseResponse<IEmailClientContact[]>>(
			this.env + ApiRoutes.Clients.clientContacts,
			{},
			{
				params: { clientId },
				observe: "response",
			}
		);
	}

	saveClientContacts(contactData: IClientContact): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post<IBaseResponse<any>>(
			this.env + ApiRoutes.Emails.createClientContact,
			{ ...contactData },
			{
				observe: "response",
			}
		);
	}
}
