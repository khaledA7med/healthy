import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ILibrariesReq } from "src/app/shared/app/models/MasterTables/production/i-libraries-form";
import { ILibrariesFilter } from "src/app/shared/app/models/MasterTables/production/i-libraries-filter";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { ILifePlanReq } from "src/app/shared/app/models/MasterTables/production/i-life-plan-form";
import { IVehicleMakeFilter, IVehicleMakeReq } from "src/app/shared/app/models/MasterTables/production/i-vehicle-make";
import { ILifePlanFilter } from "src/app/shared/app/models/MasterTables/production/i-life-plan-filter";
import { IVehicleColorFilter, IVehicleColorReq } from "src/app/shared/app/models/MasterTables/production/i-vehicle-color";
import { IVehicleTypeFilter, IVehicleTypeReq } from "src/app/shared/app/models/MasterTables/production/i-vehicle-type";

@Injectable({
	providedIn: "root",
})
export class MasterTableProductionService {
	constructor(private http: HttpClient) {}
	private readonly env = environment.baseURL;
	//#region Libraries Functions
	getAllItems(uri: string, data: { insurClass: string; lineOfBusiness: string }): Observable<HttpResponse<IBaseResponse<ILibrariesFilter[]>>> {
		return this.http.post<IBaseResponse<ILibrariesFilter[]>>(this.env + uri, { ...data }, { observe: "response" });
	}

	saveItem(uri: string, data: ILibrariesReq): Observable<IBaseResponse<ILibrariesReq[]>> {
		return this.http.post<IBaseResponse<ILibrariesReq[]>>(this.env + uri, { ...data });
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
	getLifePlans(insuranceCompany: string): Observable<HttpResponse<IBaseResponse<ILifePlanFilter[]>>> {
		return this.http.post<IBaseResponse<ILifePlanFilter[]>>(
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
	//#region VehicleMake Functions
	getVehicleMake(): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post<IBaseResponse<IVehicleMakeFilter[]>>(
			this.env + ApiRoutes.masterTables.production.vehicleMake.search,
			{},
			{ observe: "response" }
		);
	}

	saveVehicleMake(data: IVehicleMakeReq): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any[]>>(this.env + ApiRoutes.masterTables.production.vehicleMake.save, { ...data });
	}

	editVehicleMake(id: string): Observable<IBaseResponse<IVehicleMakeReq>> {
		return this.http.get<IBaseResponse<IVehicleMakeReq>>(this.env + ApiRoutes.masterTables.production.vehicleMake.edit, {
			params: { id },
		});
	}

	deleteVehicleMake(id: string): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(
			this.env + ApiRoutes.masterTables.production.vehicleMake.delete,
			{},
			{
				params: { id },
			}
		);
	}
	//#endregion

	//#region VehicleType Functions
	getVehicleType(MakeName: string): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post<IBaseResponse<IVehicleTypeFilter[]>>(
			this.env + ApiRoutes.masterTables.production.vehicleType.search,
			{},
			{ params: { MakeName }, observe: "response" }
		);
	}

	saveVehicleType(data: IVehicleTypeReq): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any[]>>(this.env + ApiRoutes.masterTables.production.vehicleType.save, { ...data });
	}

	editVehicleType(id: string): Observable<IBaseResponse<IVehicleTypeReq>> {
		return this.http.get<IBaseResponse<IVehicleTypeReq>>(this.env + ApiRoutes.masterTables.production.vehicleType.edit, {
			params: { id },
		});
	}

	deleteVehicleType(id: string): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(
			this.env + ApiRoutes.masterTables.production.vehicleType.delete,
			{},
			{
				params: { id },
			}
		);
	}
	//#endregion

	//#region VehicleColor Functions
	getVehicleColor(): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post<IBaseResponse<IVehicleColorFilter[]>>(
			this.env + ApiRoutes.masterTables.production.vehicleColor.search,
			{},
			{ observe: "response" }
		);
	}

	saveVehicleColor(data: IVehicleColorReq): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any[]>>(this.env + ApiRoutes.masterTables.production.vehicleColor.save, { ...data });
	}

	editVehicleColor(id: string): Observable<IBaseResponse<IVehicleColorReq>> {
		return this.http.get<IBaseResponse<IVehicleColorReq>>(this.env + ApiRoutes.masterTables.production.vehicleColor.edit, {
			params: { id },
		});
	}

	deleteVehicleColor(id: string): Observable<IBaseResponse<any>> {
		return this.http.post<IBaseResponse<any>>(
			this.env + ApiRoutes.masterTables.production.vehicleColor.delete,
			{},
			{
				params: { id },
			}
		);
	}
	//#endregion
}
