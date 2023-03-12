import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthenticationService } from "../services/auth.service";
import { localStorageKeys } from "../models/localStorageKeys";
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          const token = localStorage.getItem(localStorageKeys.JWT);
          const refesh = localStorage.getItem(localStorageKeys.Refresh);
          if (refesh) {
            return this.auth.refreshToken(token!, refesh!).pipe(
              catchError((err) => {
                this.auth.logout();
                this.router.navigate(["/login"]);
                return of(err);
              })
            );
          } else {
            this.auth.logout();
            this.router.navigate(["/login"]);
            return of(false);
          }
        }
        return throwError(err);
      })
    );
  }
}
