import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { environment } from "src/environments/environment";
import {
  ILocations,
  ILocationsData,
} from "../../app/models/MasterTables/i-locations";

@Injectable({
  providedIn: "root",
})
export class LocationsService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getLocations(): Observable<HttpResponse<IBaseResponse<ILocations[]>>> {
    return this.http.post<IBaseResponse<ILocations[]>>(
      this.env + ApiRoutes.masterTables.locations.search,
      {},
      {
        observe: "response",
      }
    );
  }

  saveLocations(data: ILocationsData): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.locations.save,
      data
    );
  }

  getEditLocations(id: string): Observable<IBaseResponse<ILocationsData>> {
    return this.http.get<IBaseResponse<ILocationsData>>(
      this.env + ApiRoutes.masterTables.locations.edit,
      { params: { id } }
    );
  }

  DeleteLocations(id: string): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.locations.delete,
      {},
      { params: { id } }
    );
  }
}
