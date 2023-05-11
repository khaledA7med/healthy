import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import {
  IInsuranceWorkshopDetails,
  IInsuranceWorkshopDetailsData,
  IInsuranceWorkshopDetailsFilter,
} from "src/app/shared/app/models/MasterTables/claims/i-insurance-workshop-details";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { IClaimsDocumentReq } from "src/app/shared/app/models/MasterTables/list-of-required-documents/i-claims-documents";

@Injectable({
  providedIn: "root",
})
export class InsuranceWorkshopDetailsService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getInsuranceWorkshopDetails(data: {
    insuranceCompany: string;
  }): Observable<
    HttpResponse<IBaseResponse<IInsuranceWorkshopDetailsFilter[]>>
  > {
    return this.http.post<IBaseResponse<IInsuranceWorkshopDetailsFilter[]>>(
      this.env + ApiRoutes.masterTables.Claims.insuranceWorkshopDetails.search,
      { ...data },
      { observe: "response" }
    );
  }

  saveInsuranceWorkshopDetails(
    data: IClaimsDocumentReq
  ): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.Claims.insuranceWorkshopDetails.save,
      data
    );
  }

  getEditInsuranceWorkshopDetailsData(
    id: string
  ): Observable<IBaseResponse<IInsuranceWorkshopDetailsData>> {
    return this.http.get<IBaseResponse<IInsuranceWorkshopDetailsData>>(
      this.env + ApiRoutes.masterTables.Claims.insuranceWorkshopDetails.edit,
      { params: { id } }
    );
  }

  DeleteInsuranceWorkshopDetails(
    id: string
  ): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.Claims.insuranceWorkshopDetails.delete,
      {},
      { params: { id } }
    );
  }
}
