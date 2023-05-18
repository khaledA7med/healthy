import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { IUsersFilters } from "../../app/models/Users/iusersFilters";
import { Observable } from "rxjs";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IUsers } from "../../app/models/Users/iusers";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { IUsersData } from "../../app/models/Users/iusersForm";
import { IChangeUserStatus } from "../../app/models/Users/iuser-change-status";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private readonly env: string = environment.baseURL;

  constructor(private http: HttpClient) {}

  getAllUsers(
    filters: IUsersFilters
  ): Observable<HttpResponse<IBaseResponse<IUsers[]>>> {
    return this.http.post<IBaseResponse<IUsers[]>>(
      this.env + ApiRoutes.UsersAccounts.search,
      filters,
      {
        observe: "response",
      }
    );
  }

  saveUser(data: IUsersData): Observable<HttpResponse<IBaseResponse<number>>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.UsersAccounts.save,
      data,
      { observe: "response" }
    );
  }

  getResetPassword(
    email: string
  ): Observable<HttpResponse<IBaseResponse<any>>> {
    return this.http.post<IBaseResponse<any>>(
      this.env + ApiRoutes.UsersAccounts.resetPassword,
      {},
      { params: { email: email }, observe: "response" }
    );
  }

  changeStatus(
    data: IChangeUserStatus
  ): Observable<HttpResponse<IBaseResponse<any>>> {
    return this.http.post(
      this.env + ApiRoutes.UsersAccounts.changeStatus,
      data,
      {
        observe: "response",
      }
    );
  }
}
