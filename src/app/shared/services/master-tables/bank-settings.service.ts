import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { environment } from "src/environments/environment";
import {
  IBankSettings,
  IBankSettingsData,
} from "../../app/models/MasterTables/i-bank-settings";

@Injectable({
  providedIn: "root",
})
export class BankSettingsService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getBankSettings(): Observable<HttpResponse<IBaseResponse<IBankSettings[]>>> {
    return this.http.post<IBaseResponse<IBankSettings[]>>(
      this.env + ApiRoutes.masterTables.bankSettings.search,
      {},
      {
        observe: "response",
      }
    );
  }

  saveBankSettings(data: IBankSettingsData): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.bankSettings.save,
      data
    );
  }

  getEditBankSettings(
    id: string
  ): Observable<IBaseResponse<IBankSettingsData>> {
    return this.http.get<IBaseResponse<IBankSettingsData>>(
      this.env + ApiRoutes.masterTables.bankSettings.edit,
      { params: { id } }
    );
  }

  DeleteBankSettings(id: string): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.bankSettings.delete,
      {},
      { params: { id } }
    );
  }
}
