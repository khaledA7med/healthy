import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IClaimsFilter } from "../../app/models/Claims/iclaims-filter";
import { IClaims } from "../../app/models/Claims/iclaims";
import { ApiRoutes } from "../../app/routers/ApiRoutes";

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
}
