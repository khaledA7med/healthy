import { ICustomerServiceFilters } from "src/app/shared/app/models/CustomerService/icustomer-service-filter";
import { ICustomerService } from "./../../app/models/CustomerService/icustomer-service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { ICustomerServiceFollowUp } from "../../app/models/CustomerService/icustomer-service-followup";
import { IChangeCsStatusRequest } from "../../app/models/CustomerService/icustomer-service-req";
import { CSPolicySearchRequest } from "../../app/models/CustomerService/icustomer-service-policy-search-req";
import { CSPolicyData } from "../../app/models/CustomerService/icustomer-service-policy";
import { EndorsTypeByPolicy } from "../../app/models/CustomerService/icustomer-service-utils";
import { csReportReq } from "../../app/models/CustomerService/icustomer-service-report";
import { ICustomerServiceSummary } from "../../app/models/CustomerService/icustomer-service-summary";

@Injectable({
  providedIn: "root",
})
export class CustomerServiceService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getCustomerService(
    customerServiceFilters: ICustomerServiceFilters
  ): Observable<HttpResponse<IBaseResponse<ICustomerService[]>>> {
    return this.http.post<IBaseResponse<ICustomerService[]>>(
      this.env + ApiRoutes.CustomerService.search,
      customerServiceFilters,
      {
        observe: "response",
      }
    );
  }

  getFollowUps(
    requestNo: string
  ): Observable<HttpResponse<IBaseResponse<ICustomerServiceFollowUp[]>>> {
    return this.http.post<IBaseResponse<ICustomerServiceFollowUp[]>>(
      this.env + ApiRoutes.CustomerService.followUp,
      { requestNo },
      {
        observe: "response",
      }
    );
  }

  saveNote(data: {}): Observable<HttpResponse<IBaseResponse<any>>> {
    return this.http.post(this.env + ApiRoutes.CustomerService.saveNote, data, {
      observe: "response",
    });
  }

  changeStatus(
    data: IChangeCsStatusRequest
  ): Observable<HttpResponse<IBaseResponse<any>>> {
    return this.http.post(
      this.env + ApiRoutes.CustomerService.changeStatus,
      data,
      { observe: "response" }
    );
  }

  statusCount(): Observable<HttpResponse<IBaseResponse<any>>> {
    return this.http.get(this.env + ApiRoutes.CustomerService.statusCount, {
      observe: "response",
    });
  }

  searchPolicy(
    data: CSPolicySearchRequest
  ): Observable<HttpResponse<IBaseResponse<CSPolicyData[]>>> {
    return this.http.post<IBaseResponse<CSPolicyData[]>>(
      this.env + ApiRoutes.CustomerService.searchPolicies,
      data,
      { observe: "response" }
    );
  }

  getEndorsTypeByPolicy(
    endorsType: string,
    policyNo: string
  ): Observable<HttpResponse<IBaseResponse<EndorsTypeByPolicy[]>>> {
    return this.http.post(
      this.env + ApiRoutes.CustomerService.endorseTypeByPolicy,
      {
        endorsType,
        policyNo,
      },
      { observe: "response" }
    );
  }

  getCSRequirments(
    endorsType: string,
    insuranceCompName: string,
    classofInsurance: string,
    lineOfBusiness: string
  ): Observable<HttpResponse<IBaseResponse<string[]>>> {
    return this.http.post(
      this.env + ApiRoutes.CustomerService.csRequirments,
      {
        endorsType,
        insuranceCompName,
        classofInsurance,
        lineOfBusiness,
      },
      { observe: "response" }
    );
  }

  saveRequest(data: FormData): Observable<HttpResponse<IBaseResponse<any>>> {
    return this.http.post(this.env + ApiRoutes.CustomerService.create, data, {
      observe: "response",
    });
  }

  getRequest(
    id: string
  ): Observable<HttpResponse<IBaseResponse<ICustomerService>>> {
    return this.http.get<IBaseResponse<ICustomerService>>(
      this.env + ApiRoutes.CustomerService.edit,
      {
        params: { id },
        observe: "response",
      }
    );
  }

  viewCSReport(
    body: csReportReq
  ): Observable<HttpResponse<IBaseResponse<number>>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.CustomerService.csReport,
      body,
      {
        observe: "response",
      }
    );
  }

  getRequestsSummary(): Observable<IBaseResponse<ICustomerServiceSummary>> {
    return this.http.get<IBaseResponse<ICustomerServiceSummary>>(
      this.env + ApiRoutes.CustomerService.summary
    );
  }
}
