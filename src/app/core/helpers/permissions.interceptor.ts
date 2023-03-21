import { inject, Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { PermissionsService } from "../services/permissions.service";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError, BehaviorSubject } from "rxjs";
import { catchError, switchMap, filter, take } from "rxjs/operators";
import { AuthenticationService } from "../services/auth.service";
import { Errors } from "../models/errorsCode";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { EventService } from "../services/event.service";
import { reserved } from "../models/reservedWord";
import { Router } from "@angular/router";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

@Injectable()
export class PermissionsInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private auth: AuthenticationService,
    private perm: PermissionsService,
    private message: MessagesService,
    private modalService: NgbModal,
    private canvas: NgbOffcanvas,
    private eventService: EventService,
    private router: Router
  ) {}
  errors = [
    Errors.RefreshExpired,
    Errors.InvalidRefresh,
    Errors.RefreshRevoked,
    Errors.RefeshTokenDonstMatch,
    Errors.RefreshExpired,
    Errors.ValidationError,
  ];
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.method === "POST") this.nullableValues(request);

    let currentUser = this.auth.currentToken;
    if (currentUser) request = this.addToken(request, currentUser);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === Errors.TokenExpired)
          return this.handle701Error(request, next);
        else if (this.errors.includes(error.status)) this.reusableMessage();
        else {
          let errorMessage = "An unknown error occurred.";
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // server-side error
            errorMessage = error.error.message || errorMessage;
          }
          this.eventService.broadcast(reserved.isLoading, false);
          this.message.popup("Oops!", errorMessage, "error");
        }
        return throwError(error.message);
      })
    );
  }

  private nullableValues(request: HttpRequest<any>) {
    if (request.body !== null) {
      Object.keys(request.body).map((key) => {
        if (
          !request.body[key] &&
          typeof request.body[key] !== "number" &&
          typeof request.body[key] !== "boolean"
        )
          request.body[key] = "";
      });
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        "ng-version": "1.3.0",
      },
    });
  }

  private handle701Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.perm.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.data.accessToken);
          return next.handle(this.addToken(request, token.data.accessToken));
        }),
        catchError((err: any) => {
          this.isRefreshing = false;
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }

  private reusableMessage() {
    this.modalService.dismissAll();
    this.canvas.dismiss();
    this.eventService.broadcast(reserved.isLoading, false);
    return this.message
      .timerPopup("Attention!", "You Need To Relogin")
      .then(() => {
        this.auth.logout();
        this.router.navigate([AppRoutes.Auth.login], {
          queryParams: { returnUrl: this.router.routerState.snapshot.url },
        });
      });
  }
}
