import { ICarsMake, ICarsMakeData } from './../../../app/models/MasterTables/claims/i-cars-make';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';

@Injectable({
  providedIn: 'root'
})
export class CarsMakeService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getCarsMake (): Observable<HttpResponse<IBaseResponse<ICarsMake[]>>>
  {
    return this.http.get<IBaseResponse<ICarsMake[]>>(this.env + ApiRoutes.masterTables.Claims.carsMake.search, {
      observe: "response",
    });
  }

  saveCarsMake (data: ICarsMakeData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.Claims.carsMake.save, data, { observe: "response" });
  }


  getEditCarsMake (sNo: number): Observable<HttpResponse<IBaseResponse<ICarsMakeData>>>
  {
    return this.http.post<IBaseResponse<ICarsMakeData>>(this.env + ApiRoutes.masterTables.Claims.carsMake.edit, {}, { params: { sNo }, observe: "response" });
  }

  DeleteCarsMake (sNo: number): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.Claims.carsMake.delete, {}, { params: { sNo }, observe: "response" })
  }

}
