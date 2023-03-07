import { IInsuranceCompaniesData } from './../../app/models/MasterTables/insurance-companies/i-insurance-companies';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../../app/models/App/IBaseResponse';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from '../../app/routers/ApiRoutes';
import { environment } from 'src/environments/environment';
import { IInsuranceCompanies } from '../../app/models/MasterTables/insurance-companies/i-insurance-companies';

@Injectable({
  providedIn: 'root'
})
export class InsuranceCompaniesService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getInsuranceCompanies (): Observable<HttpResponse<IBaseResponse<IInsuranceCompanies[]>>>
  {
    return this.http.post<IBaseResponse<IInsuranceCompanies[]>>(this.env + ApiRoutes.masterTables.insuranceCompanies.search, {}, {
      observe: "response",
    });
  }

  saveInsuranceClass (data: IInsuranceCompaniesData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.insuranceCompanies.save, data, { observe: "response" });
  }

  getEditInsuranceData (id: string): Observable<HttpResponse<IBaseResponse<IInsuranceCompaniesData>>>
  {
    return this.http.get<IBaseResponse<IInsuranceCompaniesData>>(this.env + ApiRoutes.masterTables.insuranceCompanies.edit, { params: { id }, observe: "response" });
  }

  DeleteInsurance (id: string): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.insuranceCompanies.delete, {}, { params: { id }, observe: "response" })
  }
}
