import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
  {
    path: AppRoutes.MasterTable.insuranceClasses,
    loadChildren: () =>
      import("./insurance-classes/insurance-classes.module").then(
        (m) => m.InsuranceClassesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterTablesRoutingModule {}
