import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomerServiceGuard, CustomerServiceFormGuard } from "src/app/core/guards/customer-service/customer-service.guard";
import { CustomerServicePermissions } from "src/app/core/roles/customer-service-permissions";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
	{
		path: AppRoutes.CustomerService.base,
		data: { title: "Request Management" },
		loadChildren: () => import("./customer-service-list/customer-service-list.module").then((m) => m.CustomerServiceListModule),
		canActivate: [() => CustomerServiceGuard([CustomerServicePermissions.ChCustomerService, CustomerServicePermissions.ChRequestsManagements])],
	},
	{
		path: AppRoutes.CustomerService.create,
		data: { title: "Customer Service Registry" },
		loadChildren: () => import("./customer-service-forms/customer-service-forms.module").then((m) => m.CustomerServiceFormsModule),
		canActivate: [
			() => CustomerServiceFormGuard([CustomerServicePermissions.ChCustomerService, CustomerServicePermissions.ChCustomerServiceReadOnly]),
		],
	},
	{
		path: AppRoutes.CustomerService.edit + ":id",
		data: { title: "Customer Service Update" },
		loadChildren: () => import("./customer-service-forms/customer-service-forms.module").then((m) => m.CustomerServiceFormsModule),
		canActivate: [
			() => CustomerServiceFormGuard([CustomerServicePermissions.ChCustomerService, CustomerServicePermissions.ChCustomerServiceReadOnly]),
		],
	},
	{
		path: AppRoutes.CustomerService.reports,
		data: { title: "CRM Reports" },
		loadChildren: () => import("./customer-service-report/customer-service-report.module").then((m) => m.CustomerServiceReportModule),
		canActivate: [() => CustomerServiceGuard([CustomerServicePermissions.ChCustomerService, CustomerServicePermissions.ChCustSerReports])],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CustomerServiceRoutingModule {}
