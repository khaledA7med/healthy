import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomerServiceFormGuard } from "src/app/core/guards/customer-service/customer-service.guard";
import { CustomerServicePermissions } from "src/app/core/roles/customer-service-permissions";
import {
  ProductionFormGuard,
  ProductionGuard,
} from "src/app/core/guards/production/production.guard";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
  {
    path: AppRoutes.Production.base,
    data: {
      title: "Production",
    },
    loadChildren: () =>
      import("./policies-management/policies-management.module").then(
        (m) => m.PoliciesManagementModule
      ),
    canActivate: [
      () =>
        ProductionGuard([
          ProductionPermissions.ChProduction,
          ProductionPermissions.ChProdPolicies,
        ]),
    ],
  },
  {
    path: AppRoutes.Production.details + "/:sno",
    outlet: "details",
    loadChildren: () =>
      import(
        "./../../shared/components/poilcy-preview/poilcy-preview.module"
      ).then((m) => m.PoilcyPreviewModule),
    canActivate: [
      () =>
        ProductionGuard([
          ProductionPermissions.ChProduction,
          ProductionPermissions.ChProdPolicies,
        ]),
    ],
  },
  {
    path: AppRoutes.Production.create,
    data: {
      title: "Create Policy",
    },
    loadChildren: () =>
      import("./policies-forms/policies-forms.module").then(
        (m) => m.PoliciesFormsModule
      ),
    canActivate: [
      () =>
        ProductionFormGuard([
          ProductionPermissions.ChProduction,
          ProductionPermissions.ChProductionReadOnly,
        ]),
    ],
  },
  {
    path: AppRoutes.Production.edit + ":id",
    data: {
      title: "Update Policy",
    },
    loadChildren: () =>
      import("./policies-forms/policies-forms.module").then(
        (m) => m.PoliciesFormsModule
      ),
    canActivate: [
      () =>
        ProductionGuard([
          ProductionPermissions.ChProduction,
          ProductionPermissions.ChEntryCorrection,
        ]),
    ],
  },
  {
    path: AppRoutes.Production.makeInvoice + ":invoice/:serial/:reqno",
    data: {
      title: "Make Invoice",
    },
    loadChildren: () =>
      import("./policies-forms/policies-forms.module").then(
        (m) => m.PoliciesFormsModule
      ),
    canActivate: [
      () =>
        CustomerServiceFormGuard([
          CustomerServicePermissions.ChCustomerService,
          CustomerServicePermissions.ChCustomerServiceReadOnly,
        ]),
    ],
  },
  {
    path: AppRoutes.Production.editCommissions,
    data: {
      title: "Edit Commissions",
    },
    loadChildren: () =>
      import(
        "./policies-edit-commissions/policies-edit-commissions.module"
      ).then((m) => m.PoliciesEditCommissionsModule),
    canActivate: [
      () =>
        ProductionGuard([
          ProductionPermissions.ChProduction,
          ProductionPermissions.ChEditCommissions,
        ]),
    ],
  },
  {
    path: AppRoutes.Production.reports.production,
    data: {
      title: "Production(statistics) Report",
    },
    loadChildren: () =>
      import("./production-report/production-report.module").then(
        (m) => m.ProductionReportModule
      ),
    canActivate: [
      () =>
        ProductionGuard([
          ProductionPermissions.ChProduction,
          ProductionPermissions.ChProdReports,
        ]),
    ],
  },
  {
    path: AppRoutes.Production.reports.renewal,
    data: {
      title: "Policies Reports - Renewals",
    },
    loadChildren: () =>
      import(
        "./production-renewal-report/production-renewal-report.module"
      ).then((m) => m.ProductionRenewalReportModule),
    canActivate: [
      () =>
        ProductionGuard([
          ProductionPermissions.ChProduction,
          ProductionPermissions.ChProdReports,
        ]),
    ],
  },
  {
    path: AppRoutes.Production.reports.renewalsNotice,
    data: {
      title: "Renewal Notice",
    },
    loadChildren: () =>
      import(
        "./production-renewal-notice-report/production-renewal-notice-report.module"
      ).then((m) => m.ProductionRenewalNoticeReportModule),
    canActivate: [
      () =>
        ProductionGuard([
          ProductionPermissions.ChProduction,
          ProductionPermissions.ChProdReports,
        ]),
    ],
  },
  {
    path: AppRoutes.Production.reports.archive.dcNote,
    data: {
      title: "Debite / Credit Notes (Clients Premium)",
    },
    loadChildren: () =>
      import("./debit-credit-note-report/debit-credit-note-report.module").then(
        (m) => m.DebitCreditNoteReportModule
      ),
    canActivate: [
      () =>
        ProductionGuard([
          ProductionPermissions.ChProduction,
          ProductionPermissions.ChProdReports,
        ]),
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionRoutingModule {}
