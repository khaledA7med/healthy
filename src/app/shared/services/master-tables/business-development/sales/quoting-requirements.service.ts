import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import {
  IQuotingRequirements,
  IQuotingRequirementsData,
  IQuotingRequirementsFilter,
} from "src/app/shared/app/models/MasterTables/business-development/sales/i-quoting-requirements";

@Injectable({
  providedIn: "root",
})
export class QuotingRequirementsService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getQuotingRequirements(data: {
    class: string;
    lineOfBusiness: string;
    insuranceCopmany: string;
  }): Observable<HttpResponse<IBaseResponse<IQuotingRequirementsFilter[]>>> {
    return this.http.post<IBaseResponse<IQuotingRequirementsFilter[]>>(
      this.env +
        ApiRoutes.masterTables.BusinessDevelopment.Sales.QuotingRequirements
          .search,
      { ...data },
      {
        observe: "response",
      }
    );
  }

  saveQuotingRequirements(
    data: IQuotingRequirementsData
  ): Observable<IBaseResponse<IQuotingRequirementsData[]>> {
    return this.http.post<IBaseResponse<IQuotingRequirementsData[]>>(
      this.env +
        ApiRoutes.masterTables.BusinessDevelopment.Sales.QuotingRequirements
          .save,
      { ...data }
    );
  }

  getEditQuotingRequirements(
    id: string
  ): Observable<IBaseResponse<IQuotingRequirementsData>> {
    return this.http.get<IBaseResponse<IQuotingRequirementsData>>(
      this.env +
        ApiRoutes.masterTables.BusinessDevelopment.Sales.QuotingRequirements
          .edit,
      { params: { id } }
    );
  }

  DeleteQuotingRequirements(id: string): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env +
        ApiRoutes.masterTables.BusinessDevelopment.Sales.QuotingRequirements
          .delete,
      {},
      { params: { id } }
    );
  }
}
