import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';
import { IComplaintSettings, IComplaintSettingsData } from 'src/app/shared/app/models/MasterTables/customer-service/i-complaint-settings';

@Injectable({
  providedIn: 'root'
})
export class ComplaintSettingsService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getComplaintSettings (): Observable<HttpResponse<IBaseResponse<IComplaintSettings[]>>>
  {
    return this.http.get<IBaseResponse<IComplaintSettings[]>>(this.env + ApiRoutes.masterTables.customerService.complaintsSettings.search, {
      observe: "response",
    });
  }

  saveComplaintSettings (data: IComplaintSettings): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.customerService.complaintsSettings.save, data, { observe: "response" });
  }
}
