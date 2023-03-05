import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
  {
    path: AppRoutes.MasterTable.insuranceClasses,
    data: {
      title: "Insurrance Classes",
    },
    loadChildren: () =>
      import("./insurance-classes/insurance-classes.module").then(
        (m) => m.InsuranceClassesModule
      ),
  },
  {
    path: AppRoutes.MasterTable.lineOfBusiness,
    data: {
      title: "Line Of Business",
    },
    loadChildren: () =>
      import("./line-of-business/line-of-business.module").then(
        (m) => m.LineOfBusinessModule
      ),
  },
  {
    path: AppRoutes.MasterTable.insuranceCompanies,
    data: {
      title: "Insurance Companies",
    },
    loadChildren: () =>
      import("./insurance-companies/insurance-companies.module").then(
        (m) => m.InsuranceCompaniesModule
      ),
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class MasterTablesRoutingModule { }
