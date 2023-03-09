import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClientGuard } from "src/app/core/guards/clients/client.guard";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
  {
    path: AppRoutes.Client.clientRegistry,
    data: {
      title: "Clients Registry",
    },
    loadChildren: () =>
      import("./client-registry-list/client-registry-list.module").then(
        (m) => m.ClientRegistryListModule
      ),
    canActivate: [ClientGuard],
  },
  {
    path: AppRoutes.Client.clientRegistry + "/:id",
    outlet: "details",
    loadChildren: () =>
      import(
        "./../../shared/components/client-preview/client-preview.module"
      ).then((m) => m.ClientPreviewModule),
  },
  {
    path: AppRoutes.Client.clientForms,
    data: {
      title: "Create Client",
    },
    loadChildren: () =>
      import("./client-registry-forms/client-registry-forms.module").then(
        (m) => m.ClientRegistryFormsModule
      ),
  },
  {
    path: AppRoutes.Client.clientEdit + ":id",
    data: {
      title: "Update Client",
    },
    loadChildren: () =>
      import("./client-registry-forms/client-registry-forms.module").then(
        (m) => m.ClientRegistryFormsModule
      ),
  },
  {
    path: AppRoutes.Client.groups,
    data: {
      title: "Client Groups",
    },
    loadChildren: () =>
      import("./client-group/client-group.module").then(
        (m) => m.ClientGroupModule
      ),
  },
  {
    path: AppRoutes.Client.reports,
    data: {
      title: "Client Reports",
    },
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
