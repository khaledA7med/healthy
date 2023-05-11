import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { environment } from "src/environments/environment";
import {
  INationalties,
  INationaltiesData,
} from "../../app/models/MasterTables/i-nationalities";

@Injectable({
  providedIn: "root",
})
export class NationalitiesService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getNationalities(): Observable<HttpResponse<IBaseResponse<INationalties[]>>> {
    return this.http.post<IBaseResponse<INationalties[]>>(
      this.env + ApiRoutes.masterTables.nationalities.search,
      {},
      {
        observe: "response",
      }
    );
  }

  saveNationalities(
    data: INationaltiesData
  ): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.nationalities.save,
      data
    );
  }

  getEditNationalities(
    id: string
  ): Observable<IBaseResponse<INationaltiesData>> {
    return this.http.get<IBaseResponse<INationaltiesData>>(
      this.env + ApiRoutes.masterTables.nationalities.edit,
      { params: { id } }
    );
  }

  DeleteNationalities(id: string): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.nationalities.delete,
      {},
      { params: { id } }
    );
  }
}
