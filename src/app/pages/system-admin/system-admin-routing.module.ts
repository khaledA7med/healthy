import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
	{
		path: AppRoutes.SystemAdmin.base,
		data: { title: "System Admin" },
		loadChildren: () => import("./user-accounts-management/user-accounts-management.module").then((m) => m.UserAccountsManagementModule),
	},
	{
		path: AppRoutes.SystemAdmin.privileges,
		data: { title: "System Admin" },
		loadChildren: () => import("./user-privileges/user-privileges.module").then((m) => m.UserPrivilegesModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SystemAdminRoutingModule {}
