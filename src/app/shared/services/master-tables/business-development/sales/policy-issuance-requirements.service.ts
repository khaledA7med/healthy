import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { IPolicyIssuanceRequirements, IPolicyIssuanceRequirementsData, IPolicyIssuanceRequirementsFilter } from 'src/app/shared/app/models/MasterTables/business-development/sales/i-policy-issuance-requirements';

@Injectable({
  providedIn: 'root'
})
export class PolicyIssuanceRequirementsService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getPolicyIssuanceRequirements (data: { class: string, lineOfBusiness: string, insuranceCopmany: string }): Observable<HttpResponse<IBaseResponse<IPolicyIssuanceRequirementsFilter[]>>>
  {
    return this.http.post<IBaseResponse<IPolicyIssuanceRequirementsFilter[]>>(this.env + ApiRoutes.masterTables.BusinessDevelopment.Sales.PolicyIssuanceRequirements.search, { ...data }, {
      observe: "response",
    });
  }

  savePolicyIssuanceRequirements (data: IPolicyIssuanceRequirementsData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.BusinessDevelopment.Sales.PolicyIssuanceRequirements.save, data, { observe: "response" });
  }


  getEditPolicyIssuanceRequirements (id: string): Observable<HttpResponse<IBaseResponse<IPolicyIssuanceRequirementsData>>>
  {
    return this.http.get<IBaseResponse<IPolicyIssuanceRequirementsData>>(this.env + ApiRoutes.masterTables.BusinessDevelopment.Sales.PolicyIssuanceRequirements.edit, { params: { id }, observe: "response" });
  }

  DeletePolicyIssuanceRequirements (id: string): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.BusinessDevelopment.Sales.PolicyIssuanceRequirements.delete, {}, { params: { id }, observe: "response" })
  }
}
