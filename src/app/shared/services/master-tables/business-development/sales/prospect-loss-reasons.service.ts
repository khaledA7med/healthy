import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { IProspectLossReasons, IProspectLossReasonsData } from 'src/app/shared/app/models/MasterTables/business-development/sales/i-prospect-loss-reasons';

@Injectable({
  providedIn: 'root'
})
export class ProspectLossReasonsService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getProspectLossReasons (): Observable<HttpResponse<IBaseResponse<IProspectLossReasons[]>>>
  {
    return this.http.post<IBaseResponse<IProspectLossReasons[]>>(this.env + ApiRoutes.masterTables.BusinessDevelopment.Sales.ProspectsLossReasons.search, {}, {
      observe: "response",
    });
  }

  saveProspectLossReasons (data: IProspectLossReasonsData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.BusinessDevelopment.Sales.ProspectsLossReasons.save, data, { observe: "response" });
  }


  getEditProspectLossReasons (id: string): Observable<HttpResponse<IBaseResponse<IProspectLossReasonsData>>>
  {
    return this.http.get<IBaseResponse<IProspectLossReasonsData>>(this.env + ApiRoutes.masterTables.BusinessDevelopment.Sales.ProspectsLossReasons.edit, { params: { id }, observe: "response" });
  }

  DeleteProspectLossReasons (id: string): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.BusinessDevelopment.Sales.ProspectsLossReasons.delete, {}, { params: { id }, observe: "response" })
  }
}
