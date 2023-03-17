import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
  ClientFormGuard,
  ClientGuard,
} from "src/app/core/guards/clients/client.guard";
import { ClientsPermissions } from "src/app/core/roles/clients-permissions";
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
    canActivate: [
      () =>
        ClientGuard([
          ClientsPermissions.ChClientsRegistryAdmin,
          ClientsPermissions.ChClientsRegistry,
        ]),
    ],
  },
  {
    path: AppRoutes.Client.clientRegistry + "/:id",
    outlet: "details",
    loadChildren: () =>
      import(
        "./../../shared/components/client-preview/client-preview.module"
      ).then((m) => m.ClientPreviewModule),
    canActivate: [
      () =>
        ClientGuard([
          ClientsPermissions.ChClientsRegistryAdmin,
          ClientsPermissions.ChClientsRegistry,
        ]),
    ],
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
    canActivate: [
      () =>
        ClientFormGuard([
          ClientsPermissions.ChClientsRegistryAdmin,
          ClientsPermissions.ChClientsRegistryAdministratorReadOnly,
        ]),
    ],
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
    canActivate: [
      () =>
        ClientFormGuard([
          ClientsPermissions.ChClientsRegistryAdmin,
          ClientsPermissions.ChClientsRegistryAdministratorReadOnly,
        ]),
    ],
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
    canActivate: [
      () =>
        ClientGuard([
          ClientsPermissions.ChClientsRegistryAdmin,
          ClientsPermissions.ChClientsGrouping,
        ]),
    ],
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
    canActivate: [
      () => ClientGuard([ClientsPermissions.ChClientsRegistryAdmin]),
    ],
  },
  {
    path: "",
    redirectTo: "/",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRoutingModule {}
