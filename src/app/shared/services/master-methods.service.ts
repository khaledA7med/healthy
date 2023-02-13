import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Caching, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../app/models/App/IBaseResponse";
import { ApiRoutes } from "../app/routers/ApiRoutes";

@Injectable({
	providedIn: "root",
})
export class MasterMethodsService {
	private readonly env: string = environment.baseURL;

	constructor(private http: HttpClient) {}

	getLineOfBusiness(classOfInc: string): Observable<HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>> {
		return this.http.post(this.env + ApiRoutes.MasterMethods.lineOfBusiness, {}, { params: { ClassName: classOfInc }, observe: "response" });
	}
}
