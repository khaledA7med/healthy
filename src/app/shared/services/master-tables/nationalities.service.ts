import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../../app/models/App/IBaseResponse';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from '../../app/routers/ApiRoutes';
import { environment } from 'src/environments/environment';
import { INationalties, INationaltiesData } from '../../app/models/MasterTables/i-nationalities';

@Injectable({
  providedIn: 'root'
})
export class NationalitiesService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getNationalities (): Observable<HttpResponse<IBaseResponse<INationalties[]>>>
  {
    return this.http.post<IBaseResponse<INationalties[]>>(this.env + ApiRoutes.masterTables.nationalities.search, {}, {
      observe: "response",
    });
  }

  saveNationalities (data: INationaltiesData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.nationalities.save, data, { observe: "response" });
  }


  getEditNationalities (id: string): Observable<HttpResponse<IBaseResponse<INationaltiesData>>>
  {
    return this.http.get<IBaseResponse<INationaltiesData>>(this.env + ApiRoutes.masterTables.nationalities.edit, { params: { id }, observe: "response" });
  }

  DeleteNationalities (id: string): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.nationalities.delete, {}, { params: { id }, observe: "response" })
  }

}
