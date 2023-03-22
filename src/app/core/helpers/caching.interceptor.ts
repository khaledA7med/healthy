import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { CachingService } from "../services/caching.service";
import { tap } from "rxjs/operators";
import { MODULE_NAME } from "src/app/core/models/MODULES";
import { Caching } from "../models/masterTableModels";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: CachingService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let module: string = request.context.get(MODULE_NAME)!;

    if (request.method !== "GET") return next.handle(request);

    const cachedResponse: HttpResponse<any> = this.cache.get(module)!;

    if (cachedResponse && (cachedResponse as unknown as Caching<any>).cacheable)
      return of(cachedResponse);

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && module) {
          this.cache.put(module, event);
        }
      })
    );
  }
}
