import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { ICancellationReasons, ICancellationReasonsData } from 'src/app/shared/app/models/MasterTables/business-development/cancellation-rejection-reasons/i-cancellation-reasons';

@Injectable({
  providedIn: 'root'
})
export class CancellationReasonsService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getCancellationReasons (): Observable<HttpResponse<IBaseResponse<ICancellationReasons[]>>>
  {
    return this.http.post<IBaseResponse<ICancellationReasons[]>>(this.env + ApiRoutes.masterTables.BusinessDevelopment.CancellationRejectionReasons.CancellationReason.search, {}, {
      observe: "response",
    });
  }

  saveCancellationReasons (data: ICancellationReasonsData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.BusinessDevelopment.CancellationRejectionReasons.CancellationReason.save, data, { observe: "response" });
  }


  getEditCancellationReasons (id: string): Observable<HttpResponse<IBaseResponse<ICancellationReasonsData>>>
  {
    return this.http.get<IBaseResponse<ICancellationReasonsData>>(this.env + ApiRoutes.masterTables.BusinessDevelopment.CancellationRejectionReasons.CancellationReason.edit, { params: { id }, observe: "response" });
  }

  DeleteCancellationReasons (id: string): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.BusinessDevelopment.CancellationRejectionReasons.CancellationReason.delete, {}, { params: { id }, observe: "response" })
  }

}
