import {
  HttpClient,
  HttpResponse,
  HttpResponseBase,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { iAddClient } from "../../app/models/Clients/iAddClient";
import { IClient } from "../../app/models/Clients/iclient";
import { IClientFilters } from "../../app/models/Clients/iclientFilters";
import { ApiRoutes } from "../../app/routers/ApiRoutes";

@Injectable({
  providedIn: "root",
})
export class ClientsService {
  private readonly env = environment.baseURL;
  constructor(private http: HttpClient) {}

  getAllClients(
    clientFilters: IClientFilters
  ): Observable<HttpResponse<IBaseResponse<IClient[]>>> {
    return this.http.post(this.env + ApiRoutes.Clients.search, clientFilters, {
      observe: "response",
    });
  }

  // createClient(client: iAddClient): Observable<HttpResponse<IBaseResponse<iAddClient[]>>>{
  //   return this.http.post(this.env + ApiRoutes.Clients.add, client, {observe: "response"});
  // }
}
