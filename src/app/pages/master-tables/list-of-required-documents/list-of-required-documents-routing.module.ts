import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MasterTablesGuard } from "src/app/core/guards/master-table/master-table.guard";
import { MasterTablePermissions } from "src/app/core/roles/master-table-permissions";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
  {
    path: AppRoutes.MasterTable.listOfDocuments.clients,
    data: {
      title: "List of Required Documents (Clients)",
    },
    loadChildren: () =>
      import("./clients-documents/clients-documents.module").then(
        (m) => m.ClientsDocumentsModule
      ),
    canActivate: [
      () =>
        MasterTablesGuard([
          MasterTablePermissions.ChMasterTabels,
          MasterTablePermissions.ChListOfRequiredDocuments,
        ]),
    ],
  },
  {
    path: AppRoutes.MasterTable.listOfDocuments.claims,
    data: {
      title: "List of Required Documents (Claims)",
    },
    loadChildren: () =>
      import("./claims-documents/claims-documents.module").then(
        (m) => m.ClaimsDocumentsModule
      ),
    canActivate: [
      () =>
        MasterTablesGuard([
          MasterTablePermissions.ChMasterTabels,
          MasterTablePermissions.ChListOfRequiredDocuments,
        ]),
    ],
  },
  {
    path: AppRoutes.MasterTable.listOfDocuments.production,
    data: {
      title: "List of Required Documents (Policies)",
    },
    loadChildren: () =>
      import("./production-documents/production-documents.module").then(
        (m) => m.ProductionDocumentsModule
      ),
    canActivate: [
      () =>
        MasterTablesGuard([
          MasterTablePermissions.ChMasterTabels,
          MasterTablePermissions.ChListOfRequiredDocuments,
        ]),
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListOfRequiredDocumentsRoutingModule {}
