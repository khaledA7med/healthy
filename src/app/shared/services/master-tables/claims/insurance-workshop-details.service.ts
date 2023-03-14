import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { IInsuranceWorkshopDetails, IInsuranceWorkshopDetailsData } from 'src/app/shared/app/models/MasterTables/claims/i-insurance-workshop-details';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';


@Injectable({
  providedIn: 'root'
})
export class InsuranceWorkshopDetailsService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getInsuranceWorkshopDetails (insuranceCompany: string): Observable<HttpResponse<IBaseResponse<IInsuranceWorkshopDetails[]>>>
  {
    return this.http.get<IBaseResponse<IInsuranceWorkshopDetails[]>>(this.env + ApiRoutes.masterTables.Claims.insuranceWorkshopDetails.search, { params: { insuranceCompany }, observe: "response" });
  }

  saveInsuranceWorkshopDetails (data: IInsuranceWorkshopDetailsData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.Claims.insuranceWorkshopDetails.save, data, { observe: "response" });
  }


  getEditInsuranceWorkshopDetailsData (sNo: number): Observable<HttpResponse<IBaseResponse<IInsuranceWorkshopDetailsData>>>
  {
    return this.http.get<IBaseResponse<IInsuranceWorkshopDetailsData>>(this.env + ApiRoutes.masterTables.Claims.insuranceWorkshopDetails.edit, { params: { sNo }, observe: "response" });
  }

  DeleteInsuranceWorkshopDetails (sNo: number): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.Claims.insuranceWorkshopDetails.delete, {}, { params: { sNo }, observe: "response" })
  }
}
