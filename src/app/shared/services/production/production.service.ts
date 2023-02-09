import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import {
  IFilterByRequest,
  IPoliciesRef,
  IPolicyClient,
  IPolicyRequests,
} from "../../app/models/Production/production-util";
import { ApiRoutes } from "../../app/routers/ApiRoutes";

@Injectable({
  providedIn: "root",
})
export class ProductionService {
  private readonly env: string = environment.baseURL;
  constructor(private http: HttpClient) {}

  //#region  Form Services
  searchClientByRequest(
    body: IFilterByRequest
  ): Observable<IBaseResponse<IPolicyRequests[]>> {
    return this.http.post<IBaseResponse<IPolicyRequests[]>>(
      this.env + ApiRoutes.Production.clientByRequest,
      {
        clientName: body.clientName,
        periodFrom: new Date(body.dateFrom!),
        periodTo: new Date(body.dateTo!),
      }
    );
  }

  searchForClient(body: any): Observable<IBaseResponse<IPolicyClient[]>> {
    return this.http.post<IBaseResponse<IPolicyClient[]>>(
      this.env + ApiRoutes.Production.searchClient,
      {
        sNo: +body.clientID,
        fullName: body.clientName,
      }
    );
  }

  searchForPolicy(body: any): Observable<IBaseResponse<IPoliciesRef[]>> {
    return this.http.post<IBaseResponse<IPoliciesRef[]>>(
      this.env + ApiRoutes.Production.searchPolicies,
      {
        clientNo: body.clientID,
        clientName: body.clientName,
        status: body.status,
      }
    );
  }
  //#endregion
}
