import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { environment } from "src/environments/environment";
import {
  IPolicyTypes,
  IPolicyTypesData,
} from "../../app/models/MasterTables/i-policy-types";

@Injectable({
  providedIn: "root",
})
export class PolicyTypesService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getPolicyTypes(): Observable<HttpResponse<IBaseResponse<IPolicyTypes[]>>> {
    return this.http.post<IBaseResponse<IPolicyTypes[]>>(
      this.env + ApiRoutes.masterTables.policyTypes.search,
      {},
      {
        observe: "response",
      }
    );
  }

  savePolicyTypes(data: IPolicyTypesData): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.policyTypes.create,
      data
    );
  }

  getEditPolicyTypes(id: string): Observable<IBaseResponse<IPolicyTypesData>> {
    return this.http.get<IBaseResponse<IPolicyTypesData>>(
      this.env + ApiRoutes.masterTables.policyTypes.edit,
      { params: { id } }
    );
  }

  DeletePolicyTypes(id: string): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.policyTypes.delete,
      {},
      { params: { id } }
    );
  }
}
