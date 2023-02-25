import { IClaimsFollowUp } from "./../../app/models/Claims/iclaims-followUp";
import { IBaseFilters } from "./../../app/models/App/IBaseFilters";
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
import { IGenericResponseType } from "src/app/core/models/masterTableModels";
import { IClaimDataForm } from "../../app/models/Claims/iclaim-data-form";

@Injectable({
  providedIn: "root",
})
export class ClaimsService {
  private readonly env = environment.baseURL;
  constructor(private http: HttpClient) {}
  getAllClaims(
    claimsFilters: IClaimsFilter | IBaseFilters
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

  searchClientClaimData(
    data: IClaimPolicies
  ): Observable<IBaseResponse<IClaimPolicies>> {
    return this.http.post<IBaseResponse<IClaimPolicies>>(
      this.env + ApiRoutes.Claims.SearchClientClaimData,
      {
        ClassOfBusiness: data.className,
        LineOfBusiness: data.lineOfBusiness,
        PolicyNo: data.policyNo,
        ClientId: data.clientNo?.toString(),
      }
    );
  }

  getClaimStatusNotes(
    state: string[]
  ): Observable<IBaseResponse<IGenericResponseType[]>> {
    return this.http.post<IBaseResponse<IGenericResponseType[]>>(
      this.env + ApiRoutes.Claims.getClaimStatusNotes,
      {
        status: state,
      }
    );
  }

  saveClaim(data: FormData): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<any>>(
      this.env + ApiRoutes.Claims.saveClaim,
      data
    );
  }

  getClaimById(
    id: string
  ): Observable<HttpResponse<IBaseResponse<IClaimDataForm>>> {
    return this.http.get<IBaseResponse<IClaimDataForm>>(
      this.env + ApiRoutes.Claims.editClaim,
      { params: { sno: id }, observe: "response" }
    );
  }

  //#endregion

  getSubStatus(
    status: string[]
  ): Observable<HttpResponse<IBaseResponse<string[]>>> {
    return this.http.post<IBaseResponse<string[]>>(
      this.env + ApiRoutes.Claims.subStatus,
      { status: status },
      { observe: "response" }
    );
  }

  getFollowUp(
    sNo: number
  ): Observable<HttpResponse<IBaseResponse<IClaimsFollowUp[]>>> {
    return this.http.post<IBaseResponse<IClaimsFollowUp[]>>(
      this.env + ApiRoutes.Claims.followUps,
      {},
      { observe: "response", params: { ClaimSno: sNo } }
    );
  }
  saveFollowUp(email: {
    no: string;
    msg: string;
    names: string[];
  }): Observable<HttpResponse<IBaseResponse<number>>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.Claims.saveFollowUps,
      email,
      { observe: "response" }
    );
  }
}
