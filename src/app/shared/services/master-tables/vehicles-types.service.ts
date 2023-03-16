import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../../app/models/App/IBaseResponse';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from '../../app/routers/ApiRoutes';
import { environment } from 'src/environments/environment';
import { IVehiclesTypes, IVehiclesTypesData } from '../../app/models/MasterTables/i-vehicles-types';

@Injectable({
  providedIn: 'root'
})
export class VehiclesTypesService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getVehiclesTypes (): Observable<HttpResponse<IBaseResponse<IVehiclesTypes[]>>>
  {
    return this.http.post<IBaseResponse<IVehiclesTypes[]>>(this.env + ApiRoutes.masterTables.vehiclesTypes.search, {}, {
      observe: "response",
    });
  }

  saveVehiclesTypes (data: IVehiclesTypesData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.vehiclesTypes.save, data, { observe: "response" });
  }


  getEditVehiclesTypes (id: string): Observable<HttpResponse<IBaseResponse<IVehiclesTypesData>>>
  {
    return this.http.get<IBaseResponse<IVehiclesTypesData>>(this.env + ApiRoutes.masterTables.vehiclesTypes.edit, { params: { id }, observe: "response" });
  }

  DeleteVehiclesTypes (id: string): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.vehiclesTypes.delete, {}, { params: { id }, observe: "response" })
  }
}
