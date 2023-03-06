import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

// Auth Services
import { AuthenticationService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // not logged in so redirect to login page with the return url
    if (!this.auth.isTokenAvailabe) {
      this.router.navigate([AppRoutes.Auth.login], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
    return true;
  }
}
