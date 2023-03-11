import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../../app/models/App/IBaseResponse';
import { IInsuranceClass, IInsuranceClassData } from '../../app/models/MasterTables/i-insurance-class';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from '../../app/routers/ApiRoutes';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InsuranceClassesService
{
  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getInsuranceClasses (): Observable<HttpResponse<IBaseResponse<IInsuranceClass[]>>>
  {
    return this.http.post<IBaseResponse<IInsuranceClass[]>>(this.env + ApiRoutes.masterTables.inuranceClasses.search, {}, {
      observe: "response",
    });
  }

  saveInsuranceClass (data: IInsuranceClassData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.inuranceClasses.save, data, { observe: "response" });
  }


  getEditInsuranceData (id: string): Observable<HttpResponse<IBaseResponse<IInsuranceClassData>>>
  {
    return this.http.get<IBaseResponse<IInsuranceClassData>>(this.env + ApiRoutes.masterTables.inuranceClasses.edit, { params: { id }, observe: "response" });
  }

  DeleteInsurance (id: string, ClassName: string): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.inuranceClasses.delete, {}, { params: { id, ClassName }, observe: "response" })
  }
}
