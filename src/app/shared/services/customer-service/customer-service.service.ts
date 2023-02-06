import { ICustomerServiceFilters } from 'src/app/shared/app/models/CustomerService/icustomer-service-filter';
import { ICustomerService } from './../../app/models/CustomerService/icustomer-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { ApiRoutes } from "../../app/routers/ApiRoutes";

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService
{
  private readonly env = environment.baseURL;

  constructor (private http: HttpClient) { }

  getCustomerService (
    customerServiceFilters: ICustomerServiceFilters
  ): Observable<HttpResponse<IBaseResponse<ICustomerService[]>>>
  {
    return this.http.post<IBaseResponse<ICustomerService[]>>(
      this.env + ApiRoutes.CustomerService.search,
      customerServiceFilters,
      {
        observe: "response",
      }
    );
  }
}
