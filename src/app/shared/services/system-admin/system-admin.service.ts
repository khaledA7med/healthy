import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { ISystemAdminFilters } from "../../app/models/SystemAdmin/isystem-admin-filters";
import { ISystemAdmin } from "../../app/models/SystemAdmin/isystem-admin";
import { IUserRoles, UserDetails } from "../../app/models/SystemAdmin/system-admin-utils";
import { UserModelData } from "../../app/models/SystemAdmin/isystem-admin-user-form";
import { IChangeUserStatus } from "../../app/models/SystemAdmin/isystem-admin-req";
import { IUserRolesPrivileges } from "../../app/models/SystemAdmin/isystem-admin-privileges";

@Injectable({
	providedIn: "root",
})
export class SystemAdminService {
	private readonly env: string = environment.baseURL;
	constructor(private http: HttpClient) {}

	getAllAdmins(filters: ISystemAdminFilters): Observable<HttpResponse<IBaseResponse<ISystemAdmin[]>>> {
		return this.http.post<IBaseResponse<ISystemAdmin[]>>(this.env + ApiRoutes.SystemAdmin.search, filters, {
			observe: "response",
		});
	}

	getAllRoles(): Observable<HttpResponse<IBaseResponse<IUserRoles[]>>> {
		return this.http.get<IBaseResponse<IUserRoles[]>>(this.env + ApiRoutes.SystemAdmin.allRoles, {
			observe: "response",
		});
	}

	addRole(data: IUserRoles): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.SystemAdmin.addRole, data, { observe: "response" });
	}

	deleteRole(sno: number): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.delete(this.env + ApiRoutes.SystemAdmin.deleteRole, {
			params: { sno },
			observe: "response",
		});
	}

	getAllPrivileges(sno: number): Observable<HttpResponse<IBaseResponse<IUserRolesPrivileges>>> {
		return this.http.get<IBaseResponse<IUserRolesPrivileges>>(this.env + ApiRoutes.SystemAdmin.getPrivileges, {
			params: { sno },
			observe: "response",
		});
	}

	editAllPrivileges(data: IUserRolesPrivileges): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.SystemAdmin.getPrivileges, data, {
			observe: "response",
		});
	}

	getUserDetails(sno: number): Observable<HttpResponse<IBaseResponse<UserDetails>>> {
		return this.http.get<IBaseResponse<UserDetails>>(this.env + ApiRoutes.SystemAdmin.userDetails, { params: { sno }, observe: "response" });
	}

	getEditUserData(id: string): Observable<HttpResponse<IBaseResponse<UserModelData>>> {
		return this.http.get<IBaseResponse<UserDetails>>(this.env + ApiRoutes.SystemAdmin.edit, { params: { id }, observe: "response" });
	}

	saveUser(data: UserModelData): Observable<HttpResponse<IBaseResponse<number>>> {
		return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.SystemAdmin.save, data, { observe: "response" });
	}

	getResetPassword(id: string): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post<IBaseResponse<any>>(this.env + ApiRoutes.SystemAdmin.changePasswordAsync, {}, { params: { id: id }, observe: "response" });
	}

	changeStatus(data: IChangeUserStatus): Observable<HttpResponse<IBaseResponse<any>>> {
		return this.http.post(this.env + ApiRoutes.SystemAdmin.changeStatus, data, {
			observe: "response",
		});
	}
}
