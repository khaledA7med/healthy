import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import {
  IClientRejectionReasons,
  IClientRejectionReasonsData,
} from "src/app/shared/app/models/MasterTables/business-development/cancellation-rejection-reasons/i-client-rejection-reasons";

@Injectable({
  providedIn: "root",
})
export class ClientRejectionReasonsService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getClientRejectionReasons(): Observable<
    HttpResponse<IBaseResponse<IClientRejectionReasons[]>>
  > {
    return this.http.post<IBaseResponse<IClientRejectionReasons[]>>(
      this.env +
        ApiRoutes.masterTables.BusinessDevelopment.CancellationRejectionReasons
          .ClientRejectionReason.search,
      {},
      {
        observe: "response",
      }
    );
  }

  saveClientRejectionReasons(
    data: IClientRejectionReasonsData
  ): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env +
        ApiRoutes.masterTables.BusinessDevelopment.CancellationRejectionReasons
          .ClientRejectionReason.save,
      data
    );
  }

  getEditClientRejectionReasons(
    id: string
  ): Observable<IBaseResponse<IClientRejectionReasonsData>> {
    return this.http.get<IBaseResponse<IClientRejectionReasonsData>>(
      this.env +
        ApiRoutes.masterTables.BusinessDevelopment.CancellationRejectionReasons
          .ClientRejectionReason.edit,
      { params: { id } }
    );
  }

  DeleteClientRejectionReasons(id: string): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env +
        ApiRoutes.masterTables.BusinessDevelopment.CancellationRejectionReasons
          .ClientRejectionReason.delete,
      {},
      { params: { id } }
    );
  }
}
