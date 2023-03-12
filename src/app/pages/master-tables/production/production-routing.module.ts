import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
	{
		path: AppRoutes.MasterTable.production.libraryOfCovers,
		data: {
			title: "Library Of Covers",
		},
		loadChildren: () => import("./library-of-covers/library-of-covers.module").then((m) => m.LibraryOfCoversModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MasterTableProductionRoutingModule {}
