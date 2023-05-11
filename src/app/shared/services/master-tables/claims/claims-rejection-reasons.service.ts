import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import {
  IClaimsRejectionReasons,
  IClaimsRejectionReasonsData,
} from "src/app/shared/app/models/MasterTables/claims/i-claims-rejection-reasons";

@Injectable({
  providedIn: "root",
})
export class ClaimsRejectionReasonsService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getClaimsRejectionReasons(
    type: string
  ): Observable<HttpResponse<IBaseResponse<IClaimsRejectionReasons[]>>> {
    return this.http.get<IBaseResponse<IClaimsRejectionReasons[]>>(
      this.env + ApiRoutes.masterTables.Claims.claimsRejectionReasons.search,
      { params: { type }, observe: "response" }
    );
  }

  saveClaimsRejectionReasons(
    data: IClaimsRejectionReasonsData
  ): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.Claims.claimsRejectionReasons.save,
      data
    );
  }

  getEditClaimsRejectionReasonsData(
    sno: number
  ): Observable<IBaseResponse<IClaimsRejectionReasonsData>> {
    return this.http.get<IBaseResponse<IClaimsRejectionReasonsData>>(
      this.env + ApiRoutes.masterTables.Claims.claimsRejectionReasons.edit,
      { params: { sno } }
    );
  }

  DeleteClaimsRejectionReasons(sno: number): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.Claims.claimsRejectionReasons.delete,
      {},
      { params: { sno } }
    );
  }
}
