import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';
import { IComplaintSuspectiveCauses, IComplaintSuspectiveCausesData } from 'src/app/shared/app/models/MasterTables/customer-service/i-complaint-suspective-causes';

@Injectable({
  providedIn: 'root'
})
export class ComplaintSuspectiveCausesService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getComplaintSuspectiveCauses (): Observable<HttpResponse<IBaseResponse<IComplaintSuspectiveCauses[]>>>
  {
    return this.http.get<IBaseResponse<IComplaintSuspectiveCauses[]>>(this.env + ApiRoutes.masterTables.customerService.complaintsSuspectiveCauses.search, {
      observe: "response",
    });
  }

  saveComplaintSuspectiveCauses (data: IComplaintSuspectiveCausesData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.customerService.complaintsSuspectiveCauses.save, data, { observe: "response" });
  }


  getEditComplaintSuspectiveCauses (sno: number): Observable<HttpResponse<IBaseResponse<IComplaintSuspectiveCausesData>>>
  {
    return this.http.get<IBaseResponse<IComplaintSuspectiveCausesData>>(this.env + ApiRoutes.masterTables.customerService.complaintsSuspectiveCauses.edit, { params: { sno }, observe: "response" });
  }

  DeleteComplaintSuspectiveCauses (sno: number): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.customerService.complaintsSuspectiveCauses.delete, {}, { params: { sno }, observe: "response" })
  }
}
