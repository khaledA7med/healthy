import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
	{
		path: AppRoutes.Production.base,
		data: {
			title: "Production",
		},
		loadChildren: () => import("./policies-management/policies-management.module").then((m) => m.PoliciesManagementModule),
	},
	{
		path: AppRoutes.Production.base + "/:sno",
		outlet: "details",
		loadChildren: () => import("./../../shared/components/poilcy-preview/poilcy-preview.module").then((m) => m.PoilcyPreviewModule),
	},
	{
		path: AppRoutes.Production.create,
		data: {
			title: "Create Policy",
		},
		loadChildren: () => import("./policies-forms/policies-forms.module").then((m) => m.PoliciesFormsModule),
	},
	{
		path: AppRoutes.Production.edit + ":id",
		loadChildren: () => import("./policies-forms/policies-forms.module").then((m) => m.PoliciesFormsModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProductionRoutingModule {}
