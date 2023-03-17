import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MasterTablesGuard } from "src/app/core/guards/master-table/master-table.guard";
import { MasterTablePermissions } from "src/app/core/roles/master-table-permissions";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
	{
		path: AppRoutes.MasterTable.production.libraryOfCovers,
		data: {
			title: "Library Of Covers",
		},
		loadChildren: () => import("./library-of-covers/library-of-covers.module").then((m) => m.LibraryOfCoversModule),
		canActivate: [() => MasterTablesGuard([MasterTablePermissions.ChMasterTabels, MasterTablePermissions.ChProductionBusinessModules])],
	},
	{
		path: AppRoutes.MasterTable.production.libraryOfInterestsInsured,
		data: {
			title: "Library Of Interests Insured",
		},
		loadChildren: () => import("./library-of-interests-insured/library-of-interests-insured.module").then((m) => m.LibraryOfInterestsInsuredModule),
		canActivate: [() => MasterTablesGuard([MasterTablePermissions.ChMasterTabels, MasterTablePermissions.ChProductionBusinessModules])],
	},
	{
		path: AppRoutes.MasterTable.production.libraryOfTerms,
		data: {
			title: "Library Of Terms And Conditions",
		},
		loadChildren: () => import("./library-of-terms/library-of-terms.module").then((m) => m.LibraryOfTermsModule),
		canActivate: [() => MasterTablesGuard([MasterTablePermissions.ChMasterTabels, MasterTablePermissions.ChProductionBusinessModules])],
	},
	{
		path: AppRoutes.MasterTable.production.libraryOfDeductibles,
		data: {
			title: "Library Of Deductibles",
		},
		loadChildren: () => import("./library-of-deductibles/library-of-deductibles.module").then((m) => m.LibraryOfDeductiblesModule),
		canActivate: [() => MasterTablesGuard([MasterTablePermissions.ChMasterTabels, MasterTablePermissions.ChProductionBusinessModules])],
	},
	{
		path: AppRoutes.MasterTable.production.libraryOfExclusions,
		data: {
			title: "Library Of Exclusions",
		},
		loadChildren: () => import("./library-of-exclusions/library-of-exclusions.module").then((m) => m.LibraryOfExclusionsModule),
		canActivate: [() => MasterTablesGuard([MasterTablePermissions.ChMasterTabels, MasterTablePermissions.ChProductionBusinessModules])],
	},
	{
		path: AppRoutes.MasterTable.production.libraryOfWarranties,
		data: {
			title: "Library Of Warranties",
		},
		loadChildren: () => import("./library-of-warranties/library-of-warranties.module").then((m) => m.LibraryOfWarrantiesModule),
		canActivate: [() => MasterTablesGuard([MasterTablePermissions.ChMasterTabels, MasterTablePermissions.ChProductionBusinessModules])],
	},
	{
		path: AppRoutes.MasterTable.production.lifePlan,
		data: {
			title: "Life Plan",
		},
		loadChildren: () => import("./life-plan/life-plan.module").then((m) => m.LifePlanModule),
		canActivate: [() => MasterTablesGuard([MasterTablePermissions.ChMasterTabels, MasterTablePermissions.ChProductionBusinessModules])],
	},
	{
		path: AppRoutes.MasterTable.production.vehiclesMake,
		data: {
			title: "Vehicle Car Make",
		},
		loadChildren: () => import("./vehicles-make/vehicles-make.module").then((m) => m.VehiclesMakeModule),
		canActivate: [() => MasterTablesGuard([MasterTablePermissions.ChMasterTabels, MasterTablePermissions.ChProductionBusinessModules])],
	},
	{
		path: AppRoutes.MasterTable.production.vehiclesType,
		data: {
			title: "Vehicle Types",
		},
		loadChildren: () => import("./vehicles-type/vehicles-type.module").then((m) => m.VehiclesTypeModule),
		canActivate: [() => MasterTablesGuard([MasterTablePermissions.ChMasterTabels, MasterTablePermissions.ChProductionBusinessModules])],
	},
	{
		path: AppRoutes.MasterTable.production.vehiclesColor,
		data: {
			title: "Vehicle Colors",
		},
		loadChildren: () => import("./vehicles-colors/vehicles-colors.module").then((m) => m.VehiclesColorsModule),
		canActivate: [() => MasterTablesGuard([MasterTablePermissions.ChMasterTabels, MasterTablePermissions.ChProductionBusinessModules])],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MasterTableProductionRoutingModule {}
