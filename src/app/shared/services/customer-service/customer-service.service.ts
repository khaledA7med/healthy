import { ICustomerServiceFilters } from "src/app/shared/app/models/CustomerService/icustomer-service-filter";
import { ICustomerService } from "./../../app/models/CustomerService/icustomer-service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { ICustomerServiceFollowUp } from "../../app/models/CustomerService/icustomer-service-followup";
import { IChangeCsStatusRequest } from "../../app/models/CustomerService/icustomer-service-req";

@Injectable({
	providedIn: "root",
})
export class CustomerServiceService {
	private readonly env = environment.baseURL;

	constructor(private http: HttpClient) {}

	getCustomerService(customerServiceFilters: ICustomerServiceFilters): Observable<HttpResponse<IBaseResponse<ICustomerService[]>>> {
		return this.http.post<IBaseResponse<ICustomerService[]>>(this.env + ApiRoutes.CustomerService.search, customerServiceFilters, {
			observe: "response",
		});
	}

	getFollowUps(requestNo: string): Observable<HttpResponse<IBaseResponse<ICustomerServiceFollowUp[]>>> {
		return this.http.post<IBaseResponse<ICustomerServiceFollowUp[]>>(
			this.env + ApiRoutes.CustomerService.followUp,
			{ requestNo },
			{
				observe: "response",
			}
		);
	}
	saveNote(data: {}): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post(this.env + ApiRoutes.CustomerService.saveNote, data, { observe: "response" });
	}

	changeStatus(data: IChangeCsStatusRequest): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post(this.env + ApiRoutes.CustomerService.changeStatus, data, { observe: "response" });
	}

	statusCount(): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.get(this.env + ApiRoutes.CustomerService.statusCount, { observe: "response" });
	}
}
