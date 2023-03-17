import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { defaultIfEmpty, map, take, tap } from "rxjs/operators";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { environment } from "src/environments/environment";
import { IPrivileges, LoginResponse } from "../models/iuser";
import { localStorageKeys } from "../models/localStorageKeys";
import { Roles } from "../roles/Roles";

@Injectable({
	providedIn: "root",
})
export class PermissionsService {
	private readonly env: string = environment.baseURL;

	private permissions$: BehaviorSubject<IPrivileges> = new BehaviorSubject<IPrivileges>({});

	constructor(private http: HttpClient) {}

	private hasPrivilege(privilege: string[], property: keyof IPrivileges): BehaviorSubject<boolean> {
		return this.getAccessRoles().pipe(
			take(1),
			map((privileges: IPrivileges) => {
				const privilegeArray = privileges?.[property] || [];
				return privilege.every((p) => privilegeArray.includes(p));
			}),
			map((authorized) => (authorized ? true : false))
		);
	}

	getAccessRoles(): BehaviorSubject<IPrivileges> | any {
		if (this.permissions$.value && Object.keys(this.permissions$.value).length > 0) return this.permissions$;
		else
			return this.http.post<IBaseResponse<IPrivileges>>(this.env + ApiRoutes.SystemAdmin.privigles, {}).pipe(
				map((res) => res.data!),
				map((perms) => {
					this.permissions$.next(perms);
					return perms!;
				}),
				defaultIfEmpty({})
			);
	}

	hasClientPrivilege(privilege: string[]): BehaviorSubject<boolean> {
		return this.hasPrivilege(privilege, Roles.Clients);
	}

	hasProductionPrivilege(privilege: string[]): BehaviorSubject<boolean> {
		return this.hasPrivilege(privilege, Roles.Production);
	}

	hasCustomerPrivilege(privilege: string[]): BehaviorSubject<boolean> {
		return this.hasPrivilege(privilege, Roles.CustomerService);
	}

	hasMasterTablesPrivilege(privilege: string[]): BehaviorSubject<boolean> {
		return this.hasPrivilege(privilege, Roles.MasterTables);
	}

	getPrivileges(module: keyof IPrivileges): Observable<string[]> {
		return this.getAccessRoles().pipe(map((privileges: IPrivileges) => privileges?.[module] || []));
	}

	refreshToken(): Observable<IBaseResponse<LoginResponse>> {
		const token = localStorage.getItem(localStorageKeys.JWT);
		const refresh = localStorage.getItem(localStorageKeys.Refresh);
		return this.http
			.post(this.env + ApiRoutes.Users.refesh, {
				accessToken: token,
				refreshToken: refresh,
			})
			.pipe(
				tap((res: IBaseResponse<LoginResponse>) => {
					localStorage.setItem(localStorageKeys.JWT, res.data?.accessToken!);
					localStorage.setItem(localStorageKeys.Refresh, res.data?.refreshToken!);
				})
			);
	}

	clearPermissions(): void {
		this.permissions$.next(null!);
	}
}
