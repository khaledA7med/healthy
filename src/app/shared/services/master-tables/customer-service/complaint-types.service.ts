import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';
import { IComplaintTypes, IComplaintTypesData } from 'src/app/shared/app/models/MasterTables/customer-service/i-complaint-types';

@Injectable({
  providedIn: 'root'
})
export class ComplaintTypesService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getComplaintTypes (): Observable<HttpResponse<IBaseResponse<IComplaintTypes[]>>>
  {
    return this.http.get<IBaseResponse<IComplaintTypes[]>>(this.env + ApiRoutes.masterTables.customerService.complaintsTypes.search, {
      observe: "response",
    });
  }

  saveComplaintTypes (data: IComplaintTypesData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.customerService.complaintsTypes.save, data, { observe: "response" });
  }


  getEditComplaintTypes (sno: number): Observable<HttpResponse<IBaseResponse<IComplaintTypesData>>>
  {
    return this.http.get<IBaseResponse<IComplaintTypesData>>(this.env + ApiRoutes.masterTables.customerService.complaintsTypes.edit, { params: { sno }, observe: "response" });
  }

  DeleteComplaintTypes (sno: number): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.customerService.complaintsTypes.delete, {}, { params: { sno }, observe: "response" })
  }
}
