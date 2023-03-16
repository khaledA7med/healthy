import { IAddCompanyRequirementsData } from './../../../app/models/MasterTables/customer-service/i-company-requirements-form';
import { ICompanyRequirementsFilter } from './../../../app/models/MasterTables/customer-service/i-company-requirements-filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';
import { ICompanyRequirements } from 'src/app/shared/app/models/MasterTables/customer-service/i-company-requirements';
@Injectable({
  providedIn: 'root'
})
export class CompanyRequirementsService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getCompanyRequirements (filter: ICompanyRequirementsFilter): Observable<HttpResponse<IBaseResponse<ICompanyRequirementsFilter[]>>>
  {
    return this.http.post<IBaseResponse<ICompanyRequirementsFilter[]>>(this.env + ApiRoutes.masterTables.customerService.customerServiceRequirements.search, { ...filter }, {
      observe: "response",
    });
  }

  saveCompanyRequirements (data: IAddCompanyRequirementsData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.customerService.customerServiceRequirements.save, data, { observe: "response" });
  }

  DeleteCompanyRequirements (sno: number): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.customerService.customerServiceRequirements.delete, {}, { params: { sno }, observe: "response" })
  }
}
