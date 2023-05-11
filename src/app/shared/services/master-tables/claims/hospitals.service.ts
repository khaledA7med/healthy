import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import {
  IHospitals,
  IHospitalsData,
} from "src/app/shared/app/models/MasterTables/claims/hospitals/i-hospitals";
import { IHospitalsPreview } from "src/app/shared/app/models/MasterTables/claims/hospitals/i-hospitals-preview";
@Injectable({
  providedIn: "root",
})
export class HospitalsService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getHospitals(): Observable<HttpResponse<IBaseResponse<IHospitals[]>>> {
    return this.http.get<IBaseResponse<IHospitals[]>>(
      this.env + ApiRoutes.masterTables.Claims.hospitals.search,
      {
        observe: "response",
      }
    );
  }

  saveHospitals(data: FormData): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.Claims.hospitals.save,
      data
    );
  }

  getEditHospitalsData(
    sno: number
  ): Observable<IBaseResponse<IHospitalsPreview>> {
    return this.http.get<IBaseResponse<IHospitalsPreview>>(
      this.env + ApiRoutes.masterTables.Claims.hospitals.edit,
      { params: { sno } }
    );
  }

  DeleteHospitals(sno: number): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.Claims.hospitals.delete,
      {},
      { params: { sno } }
    );
  }
}
