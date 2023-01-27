import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { CachingInterceptor } from "./caching.interceptor";
import { ErrorInterceptor } from "./error.interceptor";
import { JwtInterceptor } from "./jwt.interceptor";
import { PermissionsInterceptor } from "./permissions.interceptor";

export const interceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: PermissionsInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CachingInterceptor,
    multi: true,
  },
];
