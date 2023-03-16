import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../../app/models/App/IBaseResponse';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from '../../app/routers/ApiRoutes';
import { environment } from 'src/environments/environment';
import { IClientCategories, IClientCategoriesData } from '../../app/models/MasterTables/i-client-categories';

@Injectable({
  providedIn: 'root'
})
export class ClientCategoriesService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getClientCategories (): Observable<HttpResponse<IBaseResponse<IClientCategories[]>>>
  {
    return this.http.post<IBaseResponse<IClientCategories[]>>(this.env + ApiRoutes.masterTables.clientCategories.search, {}, {
      observe: "response",
    });
  }

  saveClientCategories (data: IClientCategoriesData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.clientCategories.save, data, { observe: "response" });
  }


  getEditClientCategories (id: string): Observable<HttpResponse<IBaseResponse<IClientCategoriesData>>>
  {
    return this.http.get<IBaseResponse<IClientCategoriesData>>(this.env + ApiRoutes.masterTables.clientCategories.edit, { params: { id }, observe: "response" });
  }

  DeleteClientCategories (id: string): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.clientCategories.delete, {}, { params: { id }, observe: "response" })
  }
}