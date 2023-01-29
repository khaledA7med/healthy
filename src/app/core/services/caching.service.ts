import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable, of } from "rxjs";
import { IBaseMasterTable } from "../models/masterTableModels";

@Injectable({
  providedIn: "root",
})
export class CachingService {
  private requests: any = {};
  private data: BehaviorSubject<IBaseMasterTable> =
    new BehaviorSubject<IBaseMasterTable>({});
  constructor() {}

  get(url: string): HttpResponse<any> | undefined {
    return this.requests[url];
  }

  getAll() {
    return this.data;
  }

  put(url: string, response: HttpResponse<any>): void {
    this.requests[url] = response.body.data;
    this.data.next(this.requests);
  }

  invalidateUrl(url: string): void {
    this.requests[url] = undefined;
  }

  invalidateCache(): void {
    this.requests = {};
  }
}
