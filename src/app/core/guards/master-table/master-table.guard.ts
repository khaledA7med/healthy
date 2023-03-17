import { inject } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { PermissionsService } from "../../services/permissions.service";

export const MasterTablesGuard = (permissions: string[]): Observable<boolean | UrlTree> | boolean => {
	const permission = inject(PermissionsService);
	const router = inject(Router);
	return permission.hasMasterTablesPrivilege(permissions).pipe(
		map((hasAccess: boolean) => {
			console.log(hasAccess);
			if (!hasAccess) router.navigate([AppRoutes.Error.notAuth]);
			return hasAccess;
		})
	);
};
