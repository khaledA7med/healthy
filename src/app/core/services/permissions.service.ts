import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, of } from "rxjs";
import { catchError, map, take, tap } from "rxjs/operators";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { environment } from "src/environments/environment";
import { Privigles } from "../models/iuser";
import { localStorageKeys } from "../models/localStorageKeys";
import { ClientsPermissions } from "../roles/clients-permissions";

@Injectable({
  providedIn: "root",
})
export class PermissionsService {
  private readonly env: string = environment.baseURL;

  permissions: BehaviorSubject<Privigles> = new BehaviorSubject<Privigles>(
    null!
  );

  constructor(private http: HttpClient) {}

  refreshToken(token: string, refresh: string) {
    return this.http.post(this.env + ApiRoutes.Users.refesh, {
      accessToken: token,
      refreshToken: refresh,
    });
  }

  getAccessRoles(): BehaviorSubject<Privigles> | any {
    if (this.permissions.value !== null) {
      return this.permissions;
    } else {
      return this.http
        .post<IBaseResponse<Privigles>>(
          this.env + ApiRoutes.SystemAdmin.privigles,
          {}
        )
        .pipe(tap((perm) => this.permissions.next(perm.data!)));
    }
  }

  getClientPrivilege(privilege: string[]): BehaviorSubject<boolean> {
    return this.getAccessRoles().pipe(
      take(1),
      map((privileges: IBaseResponse<Privigles>) => {
        for (let i = 0; i < privilege.length; i++)
          if (privileges.data?.Clients?.includes(privilege[i])) return true;

        return false;
      }),
      map((authorized) => (authorized ? true : false)),
      take(1),
      catchError((err: HttpErrorResponse): any => {
        if (err.status === 401) {
          const token = localStorage.getItem(localStorageKeys.JWT);
          const refesh = localStorage.getItem(localStorageKeys.Refresh);
          return this.refreshToken(token!, refesh!).pipe(
            map((res) => {
              console.log(res);
              return true;
            })
          );
        } else {
          return of(false);
        }
      })
    );
  }
}
