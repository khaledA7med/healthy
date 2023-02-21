import { IClientPreview } from "./../../app/models/Clients/iclient-preview";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IClientForms } from "../../app/models/Clients/iclientForms";
import { IClient } from "../../app/models/Clients/iclient";
import { IClientFilters } from "../../app/models/Clients/iclientFilters";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { IChangeStatusRequest } from "../../app/models/Clients/iclientStatusReq";
import { IClientReportFilters } from "../../app/models/Clients/iclient-reoprt-filters";
import AppUtils from "../../app/util";

@Injectable({
  providedIn: "root",
})
export class ClientsService {
  private readonly env = environment.baseURL;
  constructor(private http: HttpClient, private utils: AppUtils) {}

  getAllClients(
    clientFilters: IClientFilters
  ): Observable<HttpResponse<IBaseResponse<IClient[]>>> {
    return this.http.post<IBaseResponse<IClient[]>>(
      this.env + ApiRoutes.Clients.search,
      clientFilters,
      {
        observe: "response",
      }
    );
  }
  getClintDetails(
    id: string
  ): Observable<HttpResponse<IBaseResponse<IClientPreview>>> {
    return this.http.get<IBaseResponse<IClientPreview>>(
      this.env + ApiRoutes.Clients.details,
      {
        observe: "response",
        params: { id },
      }
    );
  }

  getClientById(
    id: string
  ): Observable<HttpResponse<IBaseResponse<IClientPreview>>> {
    return this.http.get<IBaseResponse<IClientPreview>>(
      this.env + ApiRoutes.Clients.edit,
      { params: { id }, observe: "response" }
    );
  }

  saveClient(body: FormData): Observable<HttpResponse<IBaseResponse<number>>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.Clients.save,
      body,
      {
        observe: "response",
      }
    );
  }

  changeStatus(
    data: IChangeStatusRequest
  ): Observable<HttpResponse<IBaseResponse<null>>> {
    return this.http.post<IBaseResponse<null>>(
      this.env + ApiRoutes.Clients.changeStatus,
      data,
      {
        observe: "response",
      }
    );
  }

  deleteDocument(data: string): Observable<HttpResponse<IBaseResponse<null>>> {
    return this.http.post<IBaseResponse<null>>(
      this.env + ApiRoutes.Clients.deleteDocument,
      { path: data },
      { observe: "response" }
    );
  }
  downloadDocument(data: string): Observable<HttpResponse<any>> {
    return this.http.post(
      this.env + ApiRoutes.Clients.downloadDocument,
      { path: data },
      { observe: "response", responseType: "blob" }
    );
  }

  viewReport(body: any): Observable<HttpResponse<IBaseResponse<any>>> {
    return this.http.post<IBaseResponse<any>>(
      this.env + ApiRoutes.Clients.report,
      {
        name: body.name,
        accountNumber: body.accountNumber,
        crNO: body.crNO,
        producer: body.producer,
        type: body.type,
        branchs: body.branchs,
        status: body.status,
        minDate: this.utils.dateFormater(body.minDate),
        maxDate: this.utils.dateFormater(body.maxDate),
      },
      { observe: "response" }
    );
  }
}
