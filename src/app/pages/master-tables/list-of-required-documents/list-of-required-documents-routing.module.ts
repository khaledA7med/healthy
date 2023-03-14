import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
	{
		path: AppRoutes.MasterTable.listOfDocuments.clients,
		data: {
			title: "List of Required Documents (Clients)",
		},
		loadChildren: () => import("./clients-documents/clients-documents.module").then((m) => m.ClientsDocumentsModule),
	},
	{
		path: AppRoutes.MasterTable.listOfDocuments.claims,
		data: {
			title: "List of Required Documents (Claims)",
		},
		loadChildren: () => import("./claims-documents/claims-documents.module").then((m) => m.ClaimsDocumentsModule),
	},
	{
		path: AppRoutes.MasterTable.listOfDocuments.production,
		data: {
			title: "List of Required Documents (Policies)",
		},
		loadChildren: () => import("./production-documents/production-documents.module").then((m) => m.ProductionDocumentsModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ListOfRequiredDocumentsRoutingModule {}
