import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { IEmailClient, IEmailClientContact, IClientContact, ICompanyContact } from "../../app/models/Email/email-utils";
import { Caching, IGenericResponseType } from "src/app/core/models/masterTableModels";

@Injectable({
	providedIn: "root",
})
export class EmailService {
	private readonly env = environment.baseURL;

	constructor(private http: HttpClient) {}

	getEmailsPriorityList(): Observable<IBaseResponse<Caching<IGenericResponseType[]>>> {
		return this.http.get<IBaseResponse<Caching<IGenericResponseType[]>>>(this.env + ApiRoutes.MasterTable.Emails.emailsPriorityList);
	}

	getAllActiveClients(clientFilters: { sNo: number; fullName: string }): Observable<HttpResponse<IBaseResponse<IEmailClient[]>>> {
		return this.http.post<IBaseResponse<IEmailClient[]>>(this.env + ApiRoutes.Emails.allActiveClients, clientFilters, {
			observe: "response",
		});
	}

	getAllCompanies(): Observable<IBaseResponse<Caching<IGenericResponseType[]>>> {
		return this.http.get<IBaseResponse<Caching<IGenericResponseType[]>>>(this.env + ApiRoutes.MasterTable.MasterTables.insuranceComapnies);
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

	getAllCompanyContacts(CompanyID: number): Observable<HttpResponse<IBaseResponse<IEmailClientContact[]>>> {
		return this.http.post<IBaseResponse<IEmailClientContact[]>>(
			this.env + ApiRoutes.MasterTable.Emails.insuranceCompaniesContact,
			{},
			{
				params: { CompanyID },
				observe: "response",
			}
		);
	}

	saveClientContacts(contactData: IClientContact): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(this.env + ApiRoutes.Emails.createClientContact, { ...contactData });
	}

	saveCompnayContacts(contactData: ICompanyContact): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(this.env + ApiRoutes.Emails.createCompanyContact, { ...contactData });
	}

	sendEmail(data: FormData): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(this.env + ApiRoutes.Emails.sendEmail, data);
	}
}
