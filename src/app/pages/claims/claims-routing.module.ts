import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
	{
		path: AppRoutes.Claims.base,
		data: {
			title: "Claims",
		},
		loadChildren: () => import("./claims-list/claims-list.module").then((m) => m.ClaimsListModule),
	},
	{
		path: AppRoutes.Claims.create,
		data: {
			title: "Create Claim",
		},
		loadChildren: () => import("./claims-forms/claims-forms.module").then((m) => m.ClaimsFormsModule),
	},
	{
		path: AppRoutes.Claims.edit + ":id",
		data: {
			title: "Update Claim",
		},
		loadChildren: () => import("./claims-forms/claims-forms.module").then((m) => m.ClaimsFormsModule),
	},
	{
		path: AppRoutes.Claims.reports,
		data: {
			title: "Claims Reports",
		},
		loadChildren: () => import("./claims-report/claims-report.module").then((m) => m.ClaimsReportModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ClaimsRoutingModule {}
