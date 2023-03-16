import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";

@Injectable({
	providedIn: "root",
})
export class MasterTableProductionService {
	constructor(private http: HttpClient) {}
	private readonly env = environment.baseURL;

	getAllItems(uri: string, data: { insurClass: string; lineOfBusiness: string }): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post<IBaseResponse<any[]>>(this.env + uri, { ...data }, { observe: "response" });
	}
}
