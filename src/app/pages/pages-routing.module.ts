import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "../extraspages/not-found/not-found.component";

// Component pages

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./master-tables/master-tables.module").then(
        (m) => m.MasterTablesModule
      ),
  },
  {
    path: "",
    loadChildren: () =>
      import("./clients/clients.module").then((m) => m.ClientsModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./business-development/business-development.module").then(
        (m) => m.BusinessDevelopmentModule
      ),
  },
  {
    path: "",
    loadChildren: () =>
      import("./customer-service/customer-service.module").then(
        (m) => m.CustomerServiceModule
      ),
  },
  {
    path: "",
    loadChildren: () =>
      import("./production/production.module").then((m) => m.ProductionModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./claims/claims.module").then((m) => m.ClaimsModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./system-admin/system-admin.module").then(
        (m) => m.SystemAdminModule
      ),
  },
  {
    path: "",
    loadChildren: () =>
      import("./email/email.module").then((m) => m.EmailModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./extrapages/extraspages.module").then(
        (m) => m.ExtraspagesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
