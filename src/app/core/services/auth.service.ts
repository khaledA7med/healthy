import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { IUser, UserAccess } from "../models/iuser";
import { localStorageKeys } from "../models/localStorageKeys";
import { JwtHelperService } from "@auth0/angular-jwt";
import { IRegister } from "src/app/shared/app/models/App/Auth/register";

@Injectable({ providedIn: "root" })

/**
 * Auth-service Component
 */
export class AuthenticationService {
  private readonly env: string = environment.baseURL;
  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login(data: IUser): Observable<any> {
    return this.http.post<any>(this.env + ApiRoutes.Users.login, data);
  }

  register(data: FormData): Observable<any> {
    return this.http.post<any>(this.env + ApiRoutes.Users.register, data);
  }
  /**
   * Logout the user
   */
  logout() {
    // logout the user
    localStorage.removeItem(localStorageKeys.JWT);
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
