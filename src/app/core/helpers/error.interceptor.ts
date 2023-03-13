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
import { Errors } from "../models/errorsCode";
import { MessagesService } from "src/app/shared/services/messages.service";
import { reserved } from "../models/reservedWord";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { EventService } from "../services/event.service";
import { PermissionsService } from "../services/permissions.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthenticationService,
    private perm: PermissionsService,
    private router: Router,
    private message: MessagesService,
    private modalService: NgbModal,
    private canvas: NgbOffcanvas,
    private eventService: EventService
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
          Errors.RefeshTokenDonstMatch,
          Errors.ForbiddenError,
        ];
        if (err.status === Errors.TokenExpired) {
          // this.perm.refreshToken();
        } else if (errors.includes(err.status)) this.reusableMessage();
        else if (err.status === 400)
          this.eventService.broadcast(reserved.isLoading, false);

        return throwError(err);
      })
    );
  }

  reusableMessage() {
    this.modalService.dismissAll();
    this.canvas.dismiss();
    this.eventService.broadcast(reserved.isLoading, false);
    return this.message
      .timerPopup("Attention!", "You Need To Relogin")
      .then(() => {
        this.auth.logout();
        this.router.navigate(["/login"]);
      });
  }
}
