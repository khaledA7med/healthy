import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../../app/models/App/IBaseResponse';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from '../../app/routers/ApiRoutes';
import { environment } from 'src/environments/environment';
import { IDefaultEmails, IDefaultEmailsData } from '../../app/models/MasterTables/i-default-emails';

@Injectable({
  providedIn: 'root'
})
export class DefaultEmailsService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getDefaultEmails (category: string): Observable<HttpResponse<IBaseResponse<IDefaultEmailsData>>>
  {
    return this.http.post<IBaseResponse<IDefaultEmailsData>>(this.env + ApiRoutes.masterTables.defaultEmail.search, {}, {
      params: { category }, observe: "response",
    });
  }

  saveDefaultEmails (data: IDefaultEmailsData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.defaultEmail.save, data, { observe: "response" });
  }

}
