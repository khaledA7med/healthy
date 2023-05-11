import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { environment } from "src/environments/environment";
import {
  IContactsListPosition,
  IContactsListPositionData,
} from "../../app/models/MasterTables/i-contacts-list-position";

@Injectable({
  providedIn: "root",
})
export class ContactsListPositionService {
  private readonly env = environment.baseURL;

  constructor(private http: HttpClient) {}

  getContactsListPosition(): Observable<
    HttpResponse<IBaseResponse<IContactsListPosition[]>>
  > {
    return this.http.post<IBaseResponse<IContactsListPosition[]>>(
      this.env + ApiRoutes.masterTables.contactsListPosition.search,
      {},
      {
        observe: "response",
      }
    );
  }

  saveContactsListPosition(
    data: IContactsListPositionData
  ): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.contactsListPosition.save,
      data
    );
  }

  getEditContactsListPosition(
    id: string
  ): Observable<IBaseResponse<IContactsListPositionData>> {
    return this.http.get<IBaseResponse<IContactsListPositionData>>(
      this.env + ApiRoutes.masterTables.contactsListPosition.edit,
      { params: { id } }
    );
  }

  DeleteContactsListPosition(id: string): Observable<IBaseResponse<number>> {
    return this.http.post<IBaseResponse<number>>(
      this.env + ApiRoutes.masterTables.contactsListPosition.delete,
      {},
      { params: { id } }
    );
  }
}
