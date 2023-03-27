import { inject } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { PermissionsService } from "../../services/permissions.service";

export const CustomerServiceGuard = (permissions: string[]): Observable<boolean | UrlTree> | boolean => {
	const permission = inject(PermissionsService);
	const router = inject(Router);
	return permission.hasCustomerPrivilege(permissions).pipe(
		map((hasAccess: boolean) => {
			if (!hasAccess) router.navigate([AppRoutes.Error.notAuth]);
			return hasAccess;
		})
	);
};

export const CustomerServiceFormGuard = (permissions: string[]): Observable<boolean | UrlTree> | boolean => {
	const permission = inject(PermissionsService);
	const router = inject(Router);
	return permission.hasCustomerPrivilege(permissions).pipe(
		map((hasAccess: boolean) => {
			if (hasAccess) router.navigate([AppRoutes.Error.notAuth]);
			return !hasAccess;
		})
	);
};
