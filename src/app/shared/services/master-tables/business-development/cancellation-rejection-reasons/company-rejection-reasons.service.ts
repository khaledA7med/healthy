import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import {
  ICompanyRejectionReasons,
  ICompanyRejectionReasonsData,
} from "src/app/shared/app/models/MasterTables/business-development/cancellation-rejection-reasons/i-company-rejection-reasons";

@Injectable({
  providedIn: "root",
})
export class CompanyRejectionReasonsService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getCompanyRejectionReasons(): Observable<
    HttpResponse<IBaseResponse<ICompanyRejectionReasons[]>>
  > {
    return this.http.post<IBaseResponse<ICompanyRejectionReasons[]>>(
      this.env +
        ApiRoutes.masterTables.BusinessDevelopment.CancellationRejectionReasons
          .CompanyRejectionReason.search,
      {},
      {
        observe: "response",
      }
    );
  }

  saveCompanyRejectionReasons(
    data: ICompanyRejectionReasonsData
  ): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env +
        ApiRoutes.masterTables.BusinessDevelopment.CancellationRejectionReasons
          .CompanyRejectionReason.save,
      data
    );
  }

  getEditCompanyRejectionReasons(
    id: string
  ): Observable<IBaseResponse<ICompanyRejectionReasonsData>> {
    return this.http.get<IBaseResponse<ICompanyRejectionReasonsData>>(
      this.env +
        ApiRoutes.masterTables.BusinessDevelopment.CancellationRejectionReasons
          .CompanyRejectionReason.edit,
      { params: { id } }
    );
  }

  DeleteCompanyRejectionReasons(id: string): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env +
        ApiRoutes.masterTables.BusinessDevelopment.CancellationRejectionReasons
          .CompanyRejectionReason.delete,
      {},
      { params: { id } }
    );
  }
}
