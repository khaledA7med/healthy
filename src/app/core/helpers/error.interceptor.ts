import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthenticationService } from "../services/auth.service";
import { localStorageKeys } from "../models/localStorageKeys";
import { Router } from "@angular/router";
import { Errors } from "../models/errorsCode";
import { MessagesService } from "src/app/shared/services/messages.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private message: MessagesService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let errors = [
          Errors.RefreshExpired,
          Errors.InvalidRefresh,
          Errors.RefreshRevoked,
          Errors.RefreshExpired,
          Errors.AccessTokenDonstMatch,
          Errors.ForbiddenError,
        ];
        if (err.status === Errors.TokenExpired) {
          const token = localStorage.getItem(localStorageKeys.JWT);
          const refesh = localStorage.getItem(localStorageKeys.Refresh);
          if (refesh)
            return this.auth.refreshToken(token!, refesh!).pipe(
              catchError((err) => {
                this.reusableMessage();
                return of(err);
              })
            );
          else return this.reusableMessage();
        } else if (errors.includes(err.status)) return this.reusableMessage();

        return this.reusableMessage();
      })
    );
  }

  reusableMessage() {
    return this.message
      .timerPopup("Attention!", "You Need To Relogin")
      .then((res) => {
        console.log(res);
        this.auth.logout();
        this.router.navigate(["/login"]);
      });
  }
}
