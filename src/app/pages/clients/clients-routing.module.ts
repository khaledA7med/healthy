import { ModalForDetailsComponent } from "./../../shared/components/modal-for-details/modal-for-details.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
  {
    path: AppRoutes.Client.clientRegistry,
    loadChildren: () =>
      import("./client-registry-list/client-registry-list.module").then(
        (m) => m.ClientRegistryListModule
      ),
  },
  {
    path: AppRoutes.Client.clientRegistry + "/:id",
    outlet: "details",
    component: ModalForDetailsComponent,
  },

  {
    path: AppRoutes.Client.clientForms,
    loadChildren: () =>
      import("./client-registry-forms/client-registry-forms.module").then(
        (m) => m.ClientRegistryFormsModule
      ),
  },
  {
    path: AppRoutes.Client.clientEdit + ":id",
    loadChildren: () =>
      import("./client-registry-forms/client-registry-forms.module").then(
        (m) => m.ClientRegistryFormsModule
      ),
  },
  {
    path: AppRoutes.Client.groups,
    loadChildren: () =>
      import("./client-group/client-group.module").then(
        (m) => m.ClientGroupModule
      ),
  },
  {
    path: AppRoutes.Client.reports,
    loadChildren: () =>
      import("./client-reports/client-reports.module").then(
        (m) => m.ClientReportsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRoutingModule {}
