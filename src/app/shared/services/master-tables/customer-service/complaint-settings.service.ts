import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { IComplaintSettingsData } from "src/app/shared/app/models/MasterTables/customer-service/i-complaint-settings";

@Injectable({
  providedIn: "root",
})
export class ComplaintSettingsService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getComplaintSettings(): Observable<IBaseResponse<IComplaintSettingsData>> {
    return this.http.get<IBaseResponse<IComplaintSettingsData>>(
      this.env +
        ApiRoutes.masterTables.customerService.complaintsSettings.search
    );
  }

  saveComplaintSettings(
    data: IComplaintSettingsData
  ): Observable<IBaseResponse<IComplaintSettingsData[]>> {
    return this.http.post<IBaseResponse<IComplaintSettingsData[]>>(
      this.env + ApiRoutes.masterTables.customerService.complaintsSettings.save,
      { ...data }
    );
  }
}
