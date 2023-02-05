import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
  {
    path: AppRoutes.BusinessDevelopment.management,
    data: { title: "Sales Lead" },
    loadChildren: () =>
      import(
        "./business-development-management/business-development-management.module"
      ).then((m) => m.BusinessDevelopmentManagementModule),
  },
  {
    path: AppRoutes.BusinessDevelopment.create,
    data: { title: "Create New Lead" },
    loadChildren: () =>
      import("./business-forms/business-forms.module").then(
        (m) => m.BusinessFormsModule
      ),
  },
  {
    path: AppRoutes.BusinessDevelopment.edit + ":id",
    data: { title: "Update Lead" },
    loadChildren: () =>
      import("./business-forms/business-forms.module").then(
        (m) => m.BusinessFormsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessDevelopmentRoutingModule {}
