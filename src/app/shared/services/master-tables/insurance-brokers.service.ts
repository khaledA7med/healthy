import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../../app/models/App/IBaseResponse';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from '../../app/routers/ApiRoutes';
import { environment } from 'src/environments/environment';
import { IInsuranceBrokers, IInsuranceBrokersData } from '../../app/models/MasterTables/i-insurance-brokers';

@Injectable({
  providedIn: 'root'
})
export class InsuranceBrokersService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getInsuranceBrokers (): Observable<HttpResponse<IBaseResponse<IInsuranceBrokers[]>>>
  {
    return this.http.post<IBaseResponse<IInsuranceBrokers[]>>(this.env + ApiRoutes.masterTables.insuranceBrokers.search, {}, {
      observe: "response",
    });
  }

  saveInsuranceBrokers (data: IInsuranceBrokersData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.insuranceBrokers.save, data, { observe: "response" });
  }


  getEditInsuranceData (id: string): Observable<HttpResponse<IBaseResponse<IInsuranceBrokersData>>>
  {
    return this.http.get<IBaseResponse<IInsuranceBrokersData>>(this.env + ApiRoutes.masterTables.insuranceBrokers.edit, { params: { id }, observe: "response" });
  }

  DeleteInsurance (id: string): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.insuranceBrokers.delete, {}, { params: { id }, observe: "response" })
  }
}
