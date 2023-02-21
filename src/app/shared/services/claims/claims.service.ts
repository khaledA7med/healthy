import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IClaimsFilter } from "../../app/models/Claims/iclaims-filter";
import { IClaims } from "../../app/models/Claims/iclaims";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import {
  IClaimPolicies,
  IClaimPoliciesSearch,
} from "../../app/models/Claims/claims-util";

@Injectable({
  providedIn: "root",
})
export class ClaimsService {
  private readonly env = environment.baseURL;
  constructor(private http: HttpClient) {}
  getAllClaims(
    claimsFilters: IClaimsFilter
  ): Observable<HttpResponse<IBaseResponse<IClaims[]>>> {
    return this.http.post<IBaseResponse<IClaims[]>>(
      this.env + ApiRoutes.Claims.search,
      claimsFilters,
      {
        observe: "response",
      }
    );
  }

  //#region Forms Section
  searchPolicy(
    filter: IClaimPoliciesSearch
  ): Observable<HttpResponse<IBaseResponse<IClaimPolicies[]>>> {
    return this.http.post<IBaseResponse<IClaimPolicies[]>>(
      this.env + ApiRoutes.Claims.searchPolicy,
      {
        PageNumber: filter.pageNumber,
        PageSize: filter.pageSize,
        orderBy: filter.orderBy,
        orderDir: filter.orderDir,
        ClientName: filter.clientName ?? "",
        PolicyNo: filter.policyNo ?? "",
        insuranceCompany: filter.insuranceCompany ?? "",
        ClassOfInsurance: filter.classOfInsurance ?? "",
        LineOfBusiness: filter.lineOfBusiness ?? "",
      },
      { observe: "response" }
    );
  }

  searchClientClaimData() {
    return this.http.post(
      this.env + ApiRoutes.Claims.SearchClientClaimData,
      {}
    );
  }
  //#endregion
}
