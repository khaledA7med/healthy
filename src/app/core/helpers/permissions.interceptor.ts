import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { PermissionsService } from "../services/permissions.service";

@Injectable()
export class PermissionsInterceptor implements HttpInterceptor {
  constructor(private permission: PermissionsService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log("first");
    return next.handle(request);
  }
}
