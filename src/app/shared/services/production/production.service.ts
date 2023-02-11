import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IDocumentReq } from "../../app/models/App/IDocumentReq";
import { IPolicy } from "../../app/models/Production/i-policy";
import { IPolicyPreview } from "../../app/models/Production/ipolicy-preview";
import { IProductionFilters } from "../../app/models/Production/iproduction-filters";
import {
  IFilterByRequest,
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
  getAllPolicies(
    filters: IProductionFilters
  ): Observable<HttpResponse<IBaseResponse<IPolicy[]>>> {
    return this.http.post<IBaseResponse<IPolicy[]>>(
      this.env + ApiRoutes.Production.search,
      filters,
      {
        observe: "response",
      }
    );
  }

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

  getPolicyById(
    sno: number
  ): Observable<HttpResponse<IBaseResponse<IPolicyPreview>>> {
    return this.http.get<IBaseResponse<IPolicyPreview>>(
      this.env + ApiRoutes.Production.details,
      { params: { sno }, observe: "response" }
    );
  }

  deleteDocument(
    data: IDocumentReq
  ): Observable<HttpResponse<IBaseResponse<null>>> {
    return this.http.post<IBaseResponse<null>>(
      this.env + ApiRoutes.MasterMethods.deleteDocument,
      { path: data },
      { observe: "response" }
    );
  }

  downloadDocument(data: IDocumentReq): Observable<HttpResponse<any>> {
    return this.http.post(
      this.env + ApiRoutes.MasterMethods.downloadDocument,
      { path: data },
      { observe: "response", responseType: "blob" }
    );
  }
}
