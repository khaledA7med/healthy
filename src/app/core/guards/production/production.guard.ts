import { inject } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { PermissionsService } from "../../services/permissions.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

export const ProductionGuard = (
  permissions: string[]
): Observable<boolean | UrlTree> | boolean => {
  const permission = inject(PermissionsService);
  const router = inject(Router);
  return permission.hasProductionPrivilege(permissions).pipe(
    map((hasAccess: boolean) => {
      if (!hasAccess) router.navigate([AppRoutes.Error.notAuth]);
      return hasAccess;
    })
  );
};

export const ProductionFormGuard = (
  permissions: string[]
): Observable<boolean | UrlTree> | boolean => {
  const permission = inject(PermissionsService);
  const router = inject(Router);
  return permission.hasProductionPrivilege(permissions).pipe(
    map((hasAccess: boolean) => {
      if (hasAccess) router.navigate([AppRoutes.Error.notAuth]);
      return !hasAccess;
    })
  );
};
