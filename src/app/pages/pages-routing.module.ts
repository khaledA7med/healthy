import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Component pages

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./insurance-policy/insurance-policy.module").then(
        (m) => m.InsurancePolicyModule
      ),
  },
  {
    path: "",
    loadChildren: () =>
      import("./requests/requests.module").then((m) => m.RequestsModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./users/users.module").then((m) => m.UsersModule),
  },
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./clients/clients.module").then((m) => m.ClientsModule),
  // },
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./business-development/business-development.module").then(
  //       (m) => m.BusinessDevelopmentModule
  //     ),
  // },
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./customer-service/customer-service.module").then(
  //       (m) => m.CustomerServiceModule
  //     ),
  // },
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./production/production.module").then((m) => m.ProductionModule),
  // },
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./claims/claims.module").then((m) => m.ClaimsModule),
  // },
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./system-admin/system-admin.module").then(
  //       (m) => m.SystemAdminModule
  //     ),
  // },
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./email/email.module").then((m) => m.EmailModule),
  // },
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./activities/activities.module").then((m) => m.ActivitiesModule),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
