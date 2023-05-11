import {
  ICarsMake,
  ICarsMakeData,
} from "./../../../app/models/MasterTables/claims/i-cars-make";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";

@Injectable({
  providedIn: "root",
})
export class CarsMakeService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getCarsMake(): Observable<HttpResponse<IBaseResponse<ICarsMake[]>>> {
    return this.http.get<IBaseResponse<ICarsMake[]>>(
      this.env + ApiRoutes.masterTables.Claims.carsMake.search,
      {
        observe: "response",
      }
    );
  }

  saveCarsMake(data: ICarsMakeData): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.Claims.carsMake.save,
      data
    );
  }

  getEditCarsMake(sno: number): Observable<IBaseResponse<ICarsMakeData>> {
    return this.http.get<IBaseResponse<ICarsMakeData>>(
      this.env + ApiRoutes.masterTables.Claims.carsMake.edit,
      { params: { sno } }
    );
  }

  DeleteCarsMake(sNo: number): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.Claims.carsMake.delete,
      {},
      { params: { sNo } }
    );
  }
}
