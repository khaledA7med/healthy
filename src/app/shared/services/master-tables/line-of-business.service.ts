import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../../app/models/App/IBaseResponse';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from '../../app/routers/ApiRoutes';
import { environment } from 'src/environments/environment';
import { ILineOfBusiness, ILineOfBusinessData } from '../../app/models/MasterTables/i-line-of-business';

@Injectable({
  providedIn: 'root'
})
export class LineOfBusinessService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getLineOfBusiness (className: string): Observable<HttpResponse<IBaseResponse<ILineOfBusiness[]>>>
  {
    return this.http.post<IBaseResponse<ILineOfBusiness[]>>(this.env + ApiRoutes.masterTables.lineOfBusiness.search, {}, { params: { className }, observe: "response" });
  }

  saveLineOfBusiness (data: ILineOfBusinessData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.lineOfBusiness.save, data, { observe: "response" });
  }


  getEditLineOfBusinessData (id: string): Observable<HttpResponse<IBaseResponse<ILineOfBusinessData>>>
  {
    return this.http.post<IBaseResponse<ILineOfBusinessData>>(this.env + ApiRoutes.masterTables.lineOfBusiness.edit, {}, { params: { id }, observe: "response" });
  }

  DeleteLineOfBusiness (id: string): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.lineOfBusiness.delete, {}, { params: { id }, observe: "response" })
  }
}
