import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';
import { ITpaList, ITpaListData } from 'src/app/shared/app/models/MasterTables/claims/i-tpa-list';

@Injectable({
  providedIn: 'root'
})
export class TpaListService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getTpaList (): Observable<HttpResponse<IBaseResponse<ITpaList[]>>>
  {
    return this.http.get<IBaseResponse<ITpaList[]>>(this.env + ApiRoutes.masterTables.Claims.tpaList.search, {
      observe: "response",
    });
  }

  saveTpaList (data: ITpaListData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.Claims.tpaList.save, data, { observe: "response" });
  }


  DeleteTpaList (sNo: number): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.Claims.tpaList.delete, {}, { params: { sNo }, observe: "response" })
  }
}
