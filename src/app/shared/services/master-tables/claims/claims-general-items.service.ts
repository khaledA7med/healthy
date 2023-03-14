import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';
import { IClaimsGeneralItems, IClaimsGeneralItemsData } from 'src/app/shared/app/models/MasterTables/claims/i-claims-general-items';

@Injectable({
  providedIn: 'root'
})
export class ClaimsGeneralItemsService
{

  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getClaimsGeneralItems (lineofBusiness: string): Observable<HttpResponse<IBaseResponse<IClaimsGeneralItems[]>>>
  {
    return this.http.get<IBaseResponse<IClaimsGeneralItems[]>>(this.env + ApiRoutes.masterTables.Claims.claimsGeneralItems.search, { params: { lineofBusiness }, observe: "response" });
  }

  saveClaimsGeneralItems (data: IClaimsGeneralItemsData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.Claims.claimsGeneralItems.save, data, { observe: "response" });
  }


  getEditClaimsGeneralItemsData (sNo: number): Observable<HttpResponse<IBaseResponse<IClaimsGeneralItemsData>>>
  {
    return this.http.get<IBaseResponse<IClaimsGeneralItemsData>>(this.env + ApiRoutes.masterTables.Claims.claimsGeneralItems.edit, { params: { sNo }, observe: "response" });
  }

  DeleteClaimsGeneralItems (sNo: number): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.Claims.claimsGeneralItems.delete, {}, { params: { sNo }, observe: "response" })
  }
}
