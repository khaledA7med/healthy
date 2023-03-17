import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
  ClaimsFormGuard,
  ClaimsGuard,
} from "src/app/core/guards/claims/claims.guard";
import { ClaimsPermissions } from "src/app/core/roles/claims-permissions";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
  {
    path: AppRoutes.Claims.base,
    data: {
      title: "Claims",
    },
    loadChildren: () =>
      import("./claims-list/claims-list.module").then(
        (m) => m.ClaimsListModule
      ),
    canActivate: [
      () =>
        ClaimsGuard([
          ClaimsPermissions.ChClaims,
          ClaimsPermissions.ChClaimsManagement,
        ]),
    ],
  },
  {
    path: AppRoutes.Claims.create,
    data: {
      title: "Create Claim",
    },
    loadChildren: () =>
      import("./claims-forms/claims-forms.module").then(
        (m) => m.ClaimsFormsModule
      ),
    canActivate: [
      () =>
        ClaimsFormGuard([
          ClaimsPermissions.ChClaims,
          ClaimsPermissions.ChClaimsManagementSystemReadOnly,
        ]),
    ],
  },
  {
    path: AppRoutes.Claims.edit + ":id",
    data: {
      title: "Update Claim",
    },
    loadChildren: () =>
      import("./claims-forms/claims-forms.module").then(
        (m) => m.ClaimsFormsModule
      ),
    canActivate: [
      () =>
        ClaimsFormGuard([
          ClaimsPermissions.ChClaims,
          ClaimsPermissions.ChClaimsManagementSystemReadOnly,
        ]),
    ],
  },
  {
    path: AppRoutes.Claims.reports,
    data: {
      title: "Claims Reports",
    },
    loadChildren: () =>
      import("./claims-report/claims-report.module").then(
        (m) => m.ClaimsReportModule
      ),
    canActivate: [
      () =>
        ClaimsGuard([
          ClaimsPermissions.ChClaims,
          ClaimsPermissions.ChClaimsReport,
        ]),
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimsRoutingModule {}
