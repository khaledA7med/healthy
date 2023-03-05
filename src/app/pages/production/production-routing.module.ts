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
		path: AppRoutes.Production.makeInvoice + ":invoice/:serial/:reqno",
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
	{
		path: AppRoutes.Production.Reports.production,
		data: {
			title: "Production(statistics) Report",
		},
		loadChildren: () => import("./production-report/production-report.module").then((m) => m.ProductionReportModule),
	},
	{
		path: AppRoutes.Production.Reports.renewal,
		data: {
			title: "Policies Reports - Renewals",
		},
		loadChildren: () =>
			import("../business-development/business-development-renewal-reports/business-development-renewal-reports.module").then(
				(m) => m.BusinessDevelopmentRenewalReportsModule
			),
	},
	{
		path: AppRoutes.Production.Reports.renewalsNotice,
		data: {
			title: "Renewal Notice",
		},
		loadChildren: () =>
			import("./production-renewal-notice-report/production-renewal-notice-report.module").then((m) => m.ProductionRenewalNoticeReportModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProductionRoutingModule {}
