import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { AuthenticationService } from "../services/auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = this.auth.currentToken;

    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser}`,
        },
      });
    }

    return next.handle(request);
  }
}
