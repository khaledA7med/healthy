import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { IDocumentReq } from 'src/app/shared/app/models/App/IDocumentReq';
import { IInsuranceCompaniesDocuments, IInsuranceCompaniesDocumentsData } from 'src/app/shared/app/models/MasterTables/customer-service/i-insurance-companies-documents';
import { ApiRoutes } from 'src/app/shared/app/routers/ApiRoutes';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InsuranceCompaniesDocumentsService
{

  private readonly env = environment.baseURL;
  constructor (private http: HttpClient) { }


  getInsuranceCompaniesDocuments (data: IInsuranceCompaniesDocumentsData): Observable<HttpResponse<IBaseResponse<IInsuranceCompaniesDocuments[]>>>
  {
    return this.http.post<IBaseResponse<IInsuranceCompaniesDocuments[]>>(this.env + ApiRoutes.masterTables.customerService.InsuranceCompaniesDocuments.search, data, { observe: "response" });
  }

  uploadInsuranceCompaniesDocuments (data: FormData): Observable<HttpResponse<IBaseResponse<number>>>
  {
    return this.http.post<IBaseResponse<number>>(this.env + ApiRoutes.masterTables.customerService.InsuranceCompaniesDocuments.upload, data, {
      observe: "response",
    });
  }

  downloadDocument (data: IDocumentReq): Observable<HttpResponse<any>>
  {
    return this.http.post(
      this.env + ApiRoutes.MasterMethods.downloadDocument,
      { path: data },
      { observe: "response", responseType: "blob" }
    );
  }

  deleteDocument (
    data: IDocumentReq
  ): Observable<HttpResponse<IBaseResponse<null>>>
  {
    return this.http.post<IBaseResponse<null>>(
      this.env + ApiRoutes.MasterMethods.deleteDocument,
      { path: data },
      { observe: "response" }
    );
  }
}
