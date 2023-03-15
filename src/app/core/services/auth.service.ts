import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { IUser, LoginResponse, UserAccess } from "../models/iuser";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { localStorageKeys } from "../models/localStorageKeys";
import { JwtHelperService } from "@auth0/angular-jwt";
import { PermissionsService } from "./permissions.service";

@Injectable({ providedIn: "root" })

/**
 * Auth-service Component
 */
export class AuthenticationService {
  private readonly env: string = environment.baseURL;
  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private perm: PermissionsService) {}

  login(data: IUser): Observable<IBaseResponse<LoginResponse>> {
    return this.http.post<IBaseResponse<LoginResponse>>(
      this.env + ApiRoutes.Users.login,
      data
    );
  }
  /**
   * Logout the user
   */
  logout() {
    // logout the user
    localStorage.removeItem(localStorageKeys.JWT);
    localStorage.removeItem(localStorageKeys.Refresh);
    this.perm.clearPermissions();
  }

  get currentToken(): string {
    return localStorage.getItem(localStorageKeys.JWT)!;
  }

  get isTokenAvailabe(): boolean {
    return !!localStorage.getItem(localStorageKeys.JWT);
  }

  get decodeToken(): UserAccess {
    return this.jwtHelper.decodeToken(
      localStorage.getItem(localStorageKeys.JWT)!
    )!;
  }

  getUser(): UserAccess {
    return this.decodeToken;
  }
}
