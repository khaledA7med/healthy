import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { environment } from "src/environments/environment";
import { ICities, ICitiesData } from "../../app/models/MasterTables/i-cities";

@Injectable({
  providedIn: "root",
})
export class CitiesService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getCities(): Observable<HttpResponse<IBaseResponse<ICities[]>>> {
    return this.http.post<IBaseResponse<ICities[]>>(
      this.env + ApiRoutes.masterTables.cities.search,
      {},
      {
        observe: "response",
      }
    );
  }

  saveCities(data: ICitiesData): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.cities.save,
      data
    );
  }

  getEditCities(id: string): Observable<IBaseResponse<ICitiesData>> {
    return this.http.get<IBaseResponse<ICitiesData>>(
      this.env + ApiRoutes.masterTables.cities.edit,
      { params: { id } }
    );
  }

  DeleteCities(id: string): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.cities.delete,
      {},
      { params: { id } }
    );
  }
}
