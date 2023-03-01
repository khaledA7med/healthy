import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../../app/models/App/IBaseResponse';
import { IInsuranceClass } from '../../app/models/MasterTables/i-insurance-class';
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
    return this.http.post<IBaseResponse<IInsuranceClass[]>>(this.env + ApiRoutes.masterTables.search, {}, {
      observe: "response",
    });
  }
}
