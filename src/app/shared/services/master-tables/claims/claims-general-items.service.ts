import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import {
  IClaimsGeneralItems,
  IClaimsGeneralItemsData,
} from "src/app/shared/app/models/MasterTables/claims/i-claims-general-items";

@Injectable({
  providedIn: "root",
})
export class ClaimsGeneralItemsService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getClaimsGeneralItems(
    data: IClaimsGeneralItemsData
  ): Observable<HttpResponse<IBaseResponse<IClaimsGeneralItems[]>>> {
    return this.http.post<IBaseResponse<IClaimsGeneralItems[]>>(
      this.env + ApiRoutes.masterTables.Claims.claimsGeneralItems.search,
      data,
      { observe: "response" }
    );
  }

  saveClaimsGeneralItems(
    data: IClaimsGeneralItemsData
  ): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.Claims.claimsGeneralItems.save,
      data
    );
  }

  getEditClaimsGeneralItemsData(
    sno: number
  ): Observable<IBaseResponse<IClaimsGeneralItemsData>> {
    return this.http.post<IBaseResponse<IClaimsGeneralItemsData>>(
      this.env + ApiRoutes.masterTables.Claims.claimsGeneralItems.edit,
      {},
      { params: { sno } }
    );
  }

  DeleteClaimsGeneralItems(sno: number): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.Claims.claimsGeneralItems.delete,
      {},
      { params: { sno } }
    );
  }
}
