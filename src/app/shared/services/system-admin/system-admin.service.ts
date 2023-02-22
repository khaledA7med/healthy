import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { ISystemAdminFilters } from '../../app/models/SystemAdmin/isystem-admin-filters';
import { ISystemAdmin } from '../../app/models/SystemAdmin/isystem-admin';
import { IChangeUserStatus } from '../../app/models/SystemAdmin/isystem-admin-req';

@Injectable({
  providedIn: 'root'
})
export class SystemAdminService
{
  private readonly env: string = environment.baseURL;
  constructor (private http: HttpClient) { }

  getAllAdmins (
    filters: ISystemAdminFilters
  ): Observable<HttpResponse<IBaseResponse<ISystemAdmin[]>>>
  {
    return this.http.post<IBaseResponse<ISystemAdmin[]>>(
      this.env + ApiRoutes.SystemAdmin.search,
      filters,
      {
        observe: "response",
      }
    );
  }

  getResetPassword (
    id: string
  ): Observable<HttpResponse<IBaseResponse<any>>>
  {
    return this.http.post<IBaseResponse<any>>(
      this.env + ApiRoutes.SystemAdmin.changePasswordAsync, {},
      { params: { id: id }, observe: "response" }
    );
  }

  changeStatus (
    data: IChangeUserStatus
  ): Observable<HttpResponse<IBaseResponse<any>>>
  {
    return this.http.post(
      this.env + ApiRoutes.SystemAdmin.changeStatus,
      data,
      { observe: "response" }
    );
  }

}
