import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ILibrariesReq } from "src/app/shared/app/models/MasterTables/production/i-libraries-form";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { ILifePlanReq } from "src/app/shared/app/models/MasterTables/production/i-life-plan-form";

@Injectable({
	providedIn: "root",
})
export class MasterTableProductionService {
	constructor(private http: HttpClient) {}
	private readonly env = environment.baseURL;
	//#region Libraries Functions
	getAllItems(uri: string, data: { insurClass: string; lineOfBusiness: string }): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post<IBaseResponse<any[]>>(this.env + uri, { ...data }, { observe: "response" });
	}

	saveItem(uri: string, data: ILibrariesReq): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any[]>>(this.env + uri, { ...data });
	}

	editItem(uri: string, id: string): Observable<IBaseResponse<ILibrariesReq>> {
		return this.http.get<IBaseResponse<ILibrariesReq>>(this.env + uri, {
			params: { id },
		});
	}

	deleteItem(uri: string, id: string): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any[]>>(
			this.env + uri,
			{},
			{
				params: { id },
			}
		);
	}
	//#endregion

	//#region Life Plan Functions
	getLifePlans(insuranceCompany: string): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post<IBaseResponse<any[]>>(
			this.env + ApiRoutes.masterTables.production.lifePlan.search,
			{ insuranceCompany },
			{ observe: "response" }
		);
	}

	saveLifePlan(data: ILifePlanReq): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any[]>>(this.env + ApiRoutes.masterTables.production.lifePlan.save, { ...data });
	}

	editLifePlan(id: string): Observable<IBaseResponse<ILifePlanReq>> {
		return this.http.get<IBaseResponse<ILifePlanReq>>(this.env + ApiRoutes.masterTables.production.lifePlan.edit, {
			params: { id },
		});
	}

	deleteLifePlan(id: string): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(
			this.env + ApiRoutes.masterTables.production.lifePlan.delete,
			{},
			{
				params: { id },
			}
		);
	}
	//#endregion
}
