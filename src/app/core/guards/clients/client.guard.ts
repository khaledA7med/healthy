import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { Privigles } from "../../models/iuser";
import { ClientsPermissions } from "../../roles/clients-permissions";
import { PermissionsService } from "../../services/permissions.service";

@Injectable({
  providedIn: "root",
})
export class ClientGuard implements CanActivate {
  constructor(
    private permission: PermissionsService,
    private message: MessagesService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
    // return this.permission
    //   .getClientPrivilege([
    //     ClientsPermissions.ChClientsRegistryAdministratorReadOnly,
    //   ])
    //   .pipe(
    //     map((hasAccess: boolean) => {
    //       if (!hasAccess) {
    //         this.message.popup(
    //           "Attention!",
    //           "You Are Not Authorized To Access",
    //           "warning"
    //         );
    //         this.router.navigate(["/"]);
    //       }

    //       return hasAccess;
    //     })
    //   );
  }
}
