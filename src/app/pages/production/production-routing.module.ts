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
		path: AppRoutes.Production.details + "/:sno",
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
		data: {
			title: "Update Policy",
		},
		loadChildren: () => import("./policies-forms/policies-forms.module").then((m) => m.PoliciesFormsModule),
	},
	{
		path: AppRoutes.Production.makeInvoice + ":invoice/:serial",
		data: {
			title: "Make Invoice",
		},
		loadChildren: () => import("./policies-forms/policies-forms.module").then((m) => m.PoliciesFormsModule),
	},
	{
		path: AppRoutes.Production.editCommissions,
		data: {
			title: "Edit Commissions",
		},
		loadChildren: () => import("./policies-edit-commissions/policies-edit-commissions.module").then((m) => m.PoliciesEditCommissionsModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProductionRoutingModule {}
