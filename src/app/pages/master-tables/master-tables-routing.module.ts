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
      import("./locations/locations.module").then((m) => m.LocationsModule),
  },
  {
    path: AppRoutes.MasterTable.businessDevelopment.Sales.QuotingRequirements,
    data: {
      title: "Quoting Requirements",
    },
    loadChildren: () =>
      import(
        "./business-development/sales/quoting-requirements/quoting-requirements.module"
      ).then((m) => m.QuotingRequirementsModule),
  },
  {
    path: AppRoutes.MasterTable.businessDevelopment.Sales
      .PolicyIssuanceRequirements,
    data: {
      title: "Policy Issuance Requirements",
    },
    loadChildren: () =>
      import(
        "./business-development/sales/policy-issuance-requirements/policy-issuance-requirements.module"
      ).then((m) => m.PolicyIssuanceRequirementsModule),
  },
  {
    path: AppRoutes.MasterTable.businessDevelopment.Sales.ProspectLossReasons,
    data: {
      title: "Prospect Loss Reasons",
    },
    loadChildren: () =>
      import(
        "./business-development/sales/prospect-loss-reasons/prospect-loss-reasons.module"
      ).then((m) => m.ProspectLossReasonsModule),
  },
  {
    path: AppRoutes.MasterTable.businessDevelopment.CancellationRejectionReasons
      .CompanyRejectionReasons,
    data: {
      title: "Company Rejection Reasons",
    },
    loadChildren: () =>
      import(
        "./business-development/cancellation-rejection-reasons/company-rejection-reasons/company-rejection-reasons.module"
      ).then((m) => m.CompanyRejectionReasonsModule),
  },
  {
    path: AppRoutes.MasterTable.businessDevelopment.CancellationRejectionReasons
      .ClientRejectionReasons,
    data: {
      title: "Client Rejection Reasons",
    },
    loadChildren: () =>
      import(
        "./business-development/cancellation-rejection-reasons/client-rejection-reasons/client-rejection-reasons.module"
      ).then((m) => m.ClientRejectionReasonsModule),
  },
  {
    path: AppRoutes.MasterTable.businessDevelopment.CancellationRejectionReasons
      .CancellationReasons,
    data: {
      title: "Cancellation Reasons",
    },
    loadChildren: () =>
      import(
        "./business-development/cancellation-rejection-reasons/cancellation-reasonssons/cancellation-reasonsons.module"
      ).then((m) => m.CancellationReasonsonsModule),
  },
  {
    path: AppRoutes.MasterTable.clientCategories,
    data: {
      title: "Client Categories",
    },
    loadChildren: () =>
      import("./client-categories/client-categories.module").then(
        (m) => m.ClientCategoriesModule
      ),
  },
  {
    path: AppRoutes.MasterTable.customerService.insuranceCompaniesDocuments,
    data: {
      title: "Insurance Companies Documents",
    },
    loadChildren: () =>
      import(
        "./customer-service/insurance-companies-documents/insurance-companies-documents.module"
      ).then((m) => m.InsuranceCompaniesDocumentsModule),
  },
  {
    path: AppRoutes.MasterTable.customerService.customerServiceRequirements,
    data: {
      title: "Customer Service Requirements",
    },
    loadChildren: () =>
      import(
        "./customer-service/customer-service-requirements/customer-service-requirements.module"
      ).then((m) => m.CustomerServiceRequirementsModule),
  },
  {
    path: AppRoutes.MasterTable.customerService.complaintsTypes,
    data: {
      title: "Complaints Types",
    },
    loadChildren: () =>
      import(
        "./customer-service/complaints-types/complaints-types.module"
      ).then((m) => m.ComplaintsTypesModule),
  },
  {
    path: AppRoutes.MasterTable.customerService.complaintsSettings,
    data: {
      title: "Complaints Settings",
    },
    loadChildren: () =>
      import(
        "./customer-service/complaints-settings/complaints-settings.module"
      ).then((m) => m.ComplaintsSettingsModule),
  },
  {
    path: AppRoutes.MasterTable.customerService.complaintsSuspectiveCauses,
    data: {
      title: "Complaints Suspective Causes",
    },
    loadChildren: () =>
      import(
        "./customer-service/complaints-suspective-causes/complaints-suspective-causes.module"
      ).then((m) => m.ComplaintsSuspectiveCausesModule),
  },
  {
    path: AppRoutes.MasterTable.customerService
      .customerServiceCancellationReason,
    data: {
      title: "Cancellation Reasons",
    },
    loadChildren: () =>
      import(
        "./customer-service/cancellation-reasons/cancellation-reasons.module"
      ).then((m) => m.CancellationReasonsModule),
  },
  {
    path: AppRoutes.MasterTable.claims.carsMake,
    data: {
      title: "Cars Make",
    },
    loadChildren: () =>
      import("./claims/cars-make/cars-make.module").then(
        (m) => m.CarsMakeModule
      ),
  },
  {
    path: AppRoutes.MasterTable.claims.hospitals,
    data: {
      title: "Hospitals",
    },
    loadChildren: () =>
      import("./claims/hospitals/hospitals.module").then(
        (m) => m.HospitalsModule
      ),
  },
  {
    path: AppRoutes.MasterTable.claims.insuranceWorkShopDetails,
    data: {
      title: "Insurance Workshop Details",
    },
    loadChildren: () =>
      import(
        "./claims/insurance-work-shop-details/insurance-work-shop-details.module"
      ).then((m) => m.InsuranceWorkShopDetailsModule),
  },
  {
    path: AppRoutes.MasterTable.claims.tpaList,
    data: {
      title: "TPA List",
    },
    loadChildren: () =>
      import("./claims/tpa-list/tpa-list.module").then((m) => m.TpaListModule),
  },
  {
    path: AppRoutes.MasterTable.claims.claimsGeneralItems,
    data: {
      title: "Claims General Items",
    },
    loadChildren: () =>
      import("./claims/claims-general-items/claims-general-items.module").then(
        (m) => m.ClaimsGeneralItemsModule
      ),
  },
  {
    path: AppRoutes.MasterTable.claims.claimsStatus,
    data: {
      title: "Claims Status",
    },
    loadChildren: () =>
      import("./claims/claims-status/claims-status.module").then(
        (m) => m.ClaimsStatusModule
      ),
  },
  {
    path: AppRoutes.MasterTable.claims.claimsRejectionReasons,
    data: {
      title: "Claims Rejection Reasons",
    },
    loadChildren: () =>
      import(
        "./claims/claims-rejection-reasons/claims-rejection-reasons.module"
      ).then((m) => m.ClaimsRejectionReasonsModule),
  },
  {
    path: AppRoutes.MasterTable.vehiclesTypes,
    data: {
      title: "Vehicles Types",
    },
    loadChildren: () =>
      import("./vehicles-types/vehicles-types.module").then(
        (m) => m.VehiclesTypesModule
      ),
  },
  {
    path: AppRoutes.MasterTable.contactsListPosition,
    data: {
      title: "Contacts List Position",
    },
    loadChildren: () =>
      import("./contacts-list-position/contacts-list-position.module").then(
        (m) => m.ContactsListPositionModule
      ),
  },
  {
    path: AppRoutes.MasterTable.cities,
    data: {
      title: "Cities",
    },
    loadChildren: () =>
      import("./cities/cities.module").then((m) => m.CitiesModule),
  },
  {
    path: AppRoutes.MasterTable.defaultEmails,
    data: {
      title: "Default Settings",
    },
    loadChildren: () =>
      import("./default-emails/default-emails.module").then(
        (m) => m.DefaultEmailsModule
      ),
  },
  {
    path: AppRoutes.MasterTable.bankSettings,
    data: {
      title: "Banks Settings",
    },
    loadChildren: () =>
      import("./bank-settings/bank-settings.module").then(
        (m) => m.BankSettingsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterTablesRoutingModule {}
