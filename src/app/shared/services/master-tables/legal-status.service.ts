import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { environment } from "src/environments/environment";
import {
  ILegalStatus,
  ILegalStatusData,
} from "../../app/models/MasterTables/i-legal-status";

@Injectable({
  providedIn: "root",
})
export class LegalStatusService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getLegalStatus(): Observable<HttpResponse<IBaseResponse<ILegalStatus[]>>> {
    return this.http.post<IBaseResponse<ILegalStatus[]>>(
      this.env + ApiRoutes.masterTables.legalStatus.search,
      {},
      {
        observe: "response",
      }
    );
  }

  saveLegalStatus(data: ILegalStatusData): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.legalStatus.save,
      data
    );
  }

  getEditLegalStatus(id: string): Observable<IBaseResponse<ILegalStatusData>> {
    return this.http.get<IBaseResponse<ILegalStatusData>>(
      this.env + ApiRoutes.masterTables.legalStatus.edit,
      { params: { id } }
    );
  }

  DeleteLegalStatus(id: string): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.legalStatus.delete,
      {},
      { params: { id } }
    );
  }
}
