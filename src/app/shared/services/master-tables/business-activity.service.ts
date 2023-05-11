import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { environment } from "src/environments/environment";
import {
  IBusinessActivity,
  IBusinessActivityData,
} from "../../app/models/MasterTables/i-business-activity";

@Injectable({
  providedIn: "root",
})
export class BusinessActivityService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getBusinessActivity(): Observable<
    HttpResponse<IBaseResponse<IBusinessActivity[]>>
  > {
    return this.http.post<IBaseResponse<IBusinessActivity[]>>(
      this.env + ApiRoutes.masterTables.businessActivity.search,
      {},
      {
        observe: "response",
      }
    );
  }

  saveBusinessActivity(
    data: IBusinessActivityData
  ): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.businessActivity.save,
      data
    );
  }

  getEditBusinessActivity(
    id: string
  ): Observable<HttpResponse<IBaseResponse<IBusinessActivityData>>> {
    return this.http.get<IBaseResponse<IBusinessActivityData>>(
      this.env + ApiRoutes.masterTables.businessActivity.edit,
      { params: { id }, observe: "response" }
    );
  }

  DeleteBusinessActivity(
    id: string
  ): Observable<HttpResponse<IBaseResponse<number>>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.businessActivity.delete,
      {},
      { params: { id }, observe: "response" }
    );
  }
}
