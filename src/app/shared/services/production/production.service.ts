import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
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
  searchClientByRequest(
    body: IFilterByRequest
  ): Observable<IBaseResponse<IPolicyRequests[]>> {
    return this.http.post<IBaseResponse<IPolicyRequests[]>>(
      this.env + ApiRoutes.Production.clientByRequest,
      {
        clientName: body.clientName,
        periodFrom: body.dateFrom,
        periodTo: body.dateTo,
      }
    );
  }
  //#endregion
}
