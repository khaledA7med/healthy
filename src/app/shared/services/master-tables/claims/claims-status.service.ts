import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import {
  IClaimsStatus,
  IClaimsStatusData,
} from "src/app/shared/app/models/MasterTables/claims/i-claims-status";

@Injectable({
  providedIn: "root",
})
export class ClaimsStatusService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getClaimsStatus(
    status: string
  ): Observable<HttpResponse<IBaseResponse<IClaimsStatus[]>>> {
    return this.http.get<IBaseResponse<IClaimsStatus[]>>(
      this.env + ApiRoutes.masterTables.Claims.claimsStatus.search,
      { params: { status }, observe: "response" }
    );
  }

  saveClaimsStatus(data: IClaimsStatusData): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.Claims.claimsStatus.save,
      data
    );
  }

  getEditClaimsStatusData(
    sno: number
  ): Observable<IBaseResponse<IClaimsStatusData>> {
    return this.http.get<IBaseResponse<IClaimsStatusData>>(
      this.env + ApiRoutes.masterTables.Claims.claimsStatus.edit,
      { params: { sno } }
    );
  }

  DeleteClaimsStatus(sno: number): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.Claims.claimsStatus.delete,
      {},
      { params: { sno } }
    );
  }
}
