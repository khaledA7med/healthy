import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IGenericResponseType } from "src/app/core/models/masterTableModels";
import { environment } from "src/environments/environment";
import { ITaskParams } from "../../app/models/Activities/itask-params";
import { ITasks } from "../../app/models/Activities/itasks";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { ApiRoutes } from "../../app/routers/ApiRoutes";
import { ITaskLog } from "../../app/models/Activities/itask-log";

@Injectable({
  providedIn: "root",
})
export class ActivitiesService {
  private readonly env = environment.baseURL;
  constructor(private http: HttpClient) {}

  getAllTasks(param: ITaskParams): Observable<IBaseResponse<ITasks[]>> {
    return this.http.post<IBaseResponse<ITasks[]>>(
      this.env + ApiRoutes.Activities.allTasks,
      param
    );
  }

  getModuleClients(
    module: string
  ): Observable<IBaseResponse<IGenericResponseType[]>> {
    return this.http.get<IBaseResponse<IGenericResponseType[]>>(
      this.env + ApiRoutes.Activities.moduleClients,
      { params: { module } }
    );
  }

  searchModule(
    module: string,
    clientId: number
  ): Observable<IBaseResponse<any>> {
    return this.http.post<IBaseResponse<any>>(
      this.env + ApiRoutes.Activities.searchModule,
      {
        module,
        clientId,
      }
    );
  }

  addTask(body: ITasks): Observable<any> {
    return this.http.post(this.env + ApiRoutes.Activities.addTask, body);
  }

  changeStatus(body: any): Observable<IBaseResponse<number>> {
    return this.http.post(this.env + ApiRoutes.Activities.changeStatus, body);
  }

  taskLogs(sno: number): Observable<IBaseResponse<ITaskLog[]>> {
    return this.http.post<IBaseResponse<ITaskLog[]>>(
      this.env + ApiRoutes.Activities.taskLogs,
      sno
    );
  }
}
