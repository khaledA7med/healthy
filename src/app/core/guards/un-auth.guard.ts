import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class UnAuthGuard implements CanActivate {
  constructor(private auth: AuthenticationService, private router: Router) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.auth.isTokenAvailabe) return true;
    this.router.navigate(["/"]);
    return false;
  }
}
