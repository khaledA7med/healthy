import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { ICancellationReasons, ICancellationReasonsData } from 'src/app/shared/app/models/MasterTables/customer-service/i-cancellation-reasons';

@Injectable({
  providedIn: 'root'
})
export class CancellationReasonsService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getCancellationReasons (): Observable<HttpResponse<IBaseResponse<ICancellationReasons[]>>>
  {
    return this.http.get<IBaseResponse<ICancellationReasons[]>>(this.env + ApiRoutes.masterTables.customerService.customerServiceCancellationReasons.search, {
      observe: "response",
    });
  }

  saveCancellationReasons (data: ICancellationReasonsData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.customerService.customerServiceCancellationReasons.save, data, { observe: "response" });
  }


  getEditCancellationReasons (sno: number): Observable<HttpResponse<IBaseResponse<ICancellationReasonsData>>>
  {
    return this.http.post<IBaseResponse<ICancellationReasonsData>>(this.env + ApiRoutes.masterTables.customerService.customerServiceCancellationReasons.edit, {}, { params: { sno }, observe: "response" });
  }

  DeleteCancellationReasons (sno: number): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.customerService.customerServiceCancellationReasons.delete, {}, { params: { sno }, observe: "response" })
  }

}
