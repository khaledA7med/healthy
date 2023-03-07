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
  {
    path: AppRoutes.MasterTable.insuranceBrokers,
    data: {
      title: "Insurance Brokers",
    },
    loadChildren: () =>
      import("./insurance-brokers/insurance-brokers.module").then(
        (m) => m.InsuranceBrokersModule
      ),
  },
  {
    path: AppRoutes.MasterTable.policyTypes,
    data: {
      title: "Policy Types",
    },
    loadChildren: () =>
      import("./policy-types/policy-types.module").then(
        (m) => m.PolicyTypesModule
      ),
  },
  {
    path: AppRoutes.MasterTable.nationalities,
    data: {
      title: "Nationalities",
    },
    loadChildren: () =>
      import("./nationalities/nationalities.module").then(
        (m) => m.NationalitiesModule
      ),
  },
  {
    path: AppRoutes.MasterTable.businessActivity,
    data: {
      title: "Business Activity",
    },
    loadChildren: () =>
      import("./business-activity/business-activity.module").then(
        (m) => m.BusinessActivityModule
      ),
  },
  {
    path: AppRoutes.MasterTable.legalStatus,
    data: {
      title: "Legal Status",
    },
    loadChildren: () =>
      import("./legal-status/legal-status.module").then(
        (m) => m.LegalStatusModule
      ),
  },
  {
    path: AppRoutes.MasterTable.locations,
    data: {
      title: "Locations",
    },
    loadChildren: () =>
      import("./locations/locations.module").then(
        (m) => m.LocationsModule
      ),
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class MasterTablesRoutingModule { }
