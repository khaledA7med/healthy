import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MASTERTABLE.TEXT",
    icon: "ri-layout-grid-line",
    subItems: [
      {
        id: 101,
        label: "MENUITEMS.MASTERTABLE.LIST.INSURANCECLASSES",
        link: AppRoutes.MasterTable.insuranceClasses,
        parentId: 1,
      },
      {
        id: 102,
        label: "MENUITEMS.MASTERTABLE.LIST.LINEOFBUSINESS",
        link: AppRoutes.MasterTable.lineOfBusiness,
        parentId: 1,
      },
      {
        id: 103,
        label: "MENUITEMS.MASTERTABLE.LIST.INSURANCECOMPANIES",
        link: AppRoutes.MasterTable.insuranceCompanies,
        parentId: 1,
      },
      {
        id: 104,
        label: "MENUITEMS.MASTERTABLE.LIST.INSURANCEBROKERS",
        link: AppRoutes.MasterTable.insuranceBrokers,
        parentId: 1,
      },
      {
        id: 105,
        label: "MENUITEMS.MASTERTABLE.LIST.POLICYTYPES",
        link: AppRoutes.MasterTable.policyTypes,
        parentId: 1,
      },
      {
        id: 106,
        label: "MENUITEMS.MASTERTABLE.LIST.NATIONALITIES",
        link: AppRoutes.MasterTable.nationalities,
        parentId: 1,
      },
      {
        id: 107,
        label: "MENUITEMS.MASTERTABLE.LIST.BUSINESSACTIVITY",
        link: AppRoutes.MasterTable.businessActivity,
        parentId: 1,
      },
      {
        id: 108,
        label: "MENUITEMS.MASTERTABLE.LIST.LEGALSTATUS",
        link: AppRoutes.MasterTable.legalStatus,
        parentId: 1,
      },
      {
        id: 109,
        label: "MENUITEMS.MASTERTABLE.LIST.LOCATIONS",
        link: AppRoutes.MasterTable.locations,
        parentId: 1,
      },
      {
        id: 110,
        label: "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.TEXT",
        parentId: 1,
        subItems: [
          {
            id: 1010,
            label: "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.SALES.TEXT",
            parentId: 110,
            subItems: [
              {
                id: 10010,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.SALES.QUOTINGREQUIREMENTS",
                link: AppRoutes.MasterTable.businessDevelopment.Sales
                  .QuotingRequirements,
                parentId: 1010,
              },
              {
                id: 10011,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.SALES.POLICYISSUANCEREQUIREMENTS",
                link: AppRoutes.MasterTable.businessDevelopment.Sales
                  .PolicyIssuanceRequirements,
                parentId: 1010,
              },
              {
                id: 10012,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.SALES.PROSPECTLOSSREASONS",
                link: AppRoutes.MasterTable.businessDevelopment.Sales
                  .ProspectLossReasons,
                parentId: 1010,
              },
            ],
          },
          {
            id: 1011,
            label:
              "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.CANCELLATION/REJECTIONREASONS.TEXT",
            parentId: 110,
            subItems: [
              {
                id: 10010,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.CANCELLATION/REJECTIONREASONS.COMPANYREJECTIONREASONS",
                link: AppRoutes.MasterTable.businessDevelopment
                  .CancellationRejectionReasons.CompanyRejectionReasons,
                parentId: 1011,
              },
              {
                id: 10011,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.CANCELLATION/REJECTIONREASONS.CLIENTREJECTIONREASONS",
                link: AppRoutes.MasterTable.businessDevelopment
                  .CancellationRejectionReasons.ClientRejectionReasons,
                parentId: 1011,
              },
              {
                id: 10012,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.CANCELLATION/REJECTIONREASONS.CANCELLATIONREASONS",
                link: AppRoutes.MasterTable.businessDevelopment
                  .CancellationRejectionReasons.CancellationReasons,
                parentId: 1011,
              },
            ],
          },
        ],
      },
      {
        id: 111,
        label: "MENUITEMS.MASTERTABLE.LIST.CLIENTCATEGORIES",
        link: AppRoutes.MasterTable.clientCategories,
        parentId: 1,
      },
      {
        id: 112,
        label: "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.TEXT",
        parentId: 1,
        subItems: [
          {
            id: 1012,
            label:
              "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.INSURANCECOMPANIESDOCUMENTS",
            link: AppRoutes.MasterTable.customerService
              .insuranceCompaniesDocuments,
            parentId: 112,
          },
          {
            id: 1013,
            label:
              "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.CUSTOMERSERVICEREQUIREMENTS",
            link: AppRoutes.MasterTable.customerService
              .customerServiceRequirements,
            parentId: 112,
          },
          {
            id: 1014,
            label: "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.COMPLAINTSTYPES",
            link: AppRoutes.MasterTable.customerService.complaintsTypes,
            parentId: 112,
          },
          {
            id: 1015,
            label:
              "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.COMPLAINTSSETTINGS",
            link: AppRoutes.MasterTable.customerService.complaintsSettings,
            parentId: 112,
          },
          {
            id: 1016,
            label:
              "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.COMPLAINTSSUSPECTIVECAUSES",
            link: AppRoutes.MasterTable.customerService
              .complaintsSuspectiveCauses,
            parentId: 112,
          },
          {
            id: 1017,
            label:
              "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.CUSTOMERSERVICERECANCELLATIONREASONS",
            link: AppRoutes.MasterTable.customerService
              .customerServiceCancellationReason,
            parentId: 112,
          },
        ],
      },
      {
        id: 114,
        label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.TEXT",
        parentId: 1,
        subItems: [
          {
            id: 1014,
            label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.CARSMAKE",
            link: AppRoutes.MasterTable.claims.carsMake,
            parentId: 114,
          },
          {
            id: 1015,
            label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.HOSPITALS",
            link: AppRoutes.MasterTable.claims.hospitals,
            parentId: 114,
          },
          {
            id: 1016,
            label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.INSURANCEWORKSHOPDETAILS",
            link: AppRoutes.MasterTable.claims.insuranceWorkShopDetails,
            parentId: 114,
          },
          {
            id: 1017,
            label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.TPALIST",
            link: AppRoutes.MasterTable.claims.tpaList,
            parentId: 114,
          },
          {
            id: 1018,
            label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.CLAIMSGENERALITEMS",
            link: AppRoutes.MasterTable.claims.claimsGeneralItems,
            parentId: 114,
          },
          {
            id: 1019,
            label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.CLAIMSSTATUS",
            link: AppRoutes.MasterTable.claims.claimsStatus,
            parentId: 114,
          },
          {
            id: 1020,
            label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.CLAIMSREJECTIONREASONS",
            link: AppRoutes.MasterTable.claims.claimsRejectionReasons,
            parentId: 114,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "MENUITEMS.CLIENTREGISTRY.TEXT",
    icon: "ri-folder-user-line",
    subItems: [
      {
        id: 201,
        label: "MENUITEMS.CLIENTREGISTRY.LIST.CLIENTREGISTRY",
        link: AppRoutes.Client.clientRegistry,
        parentId: 2,
      },
      {
        id: 202,
        label: "MENUITEMS.CLIENTREGISTRY.LIST.CLIENTGROUPS",
        link: AppRoutes.Client.groups,
        parentId: 2,
      },
      {
        id: 203,
        label: "MENUITEMS.CLIENTREGISTRY.LIST.REPORTS",
        link: AppRoutes.Client.reports,
        parentId: 2,
      },
    ],
  },
  {
    id: 3,
    label: "MENUITEMS.BUSINESSDEVELOPMENT.TEXT",
    icon: "ri-briefcase-5-line",
    subItems: [
      {
        id: 301,
        label: "MENUITEMS.BUSINESSDEVELOPMENT.LIST.DASHBOARD",
        link: AppRoutes.BusinessDevelopment.dashboard,
        parentId: 3,
      },
      {
        id: 302,
        label: "MENUITEMS.BUSINESSDEVELOPMENT.LIST.MANAGEMENT",
        link: AppRoutes.BusinessDevelopment.management,
        parentId: 3,
      },
      {
        id: 302,
        label: "MENUITEMS.BUSINESSDEVELOPMENT.LIST.REPORTS",
        parentId: 3,
        subItems: [
          {
            id: 3001,
            label:
              "MENUITEMS.BUSINESSDEVELOPMENT.LIST.REPORTLIST.BUSINESSDEVELOPMENT",
            link: AppRoutes.BusinessDevelopment.reports.business,
            parentId: 302,
          },
          {
            id: 3002,
            label: "MENUITEMS.BUSINESSDEVELOPMENT.LIST.REPORTLIST.RENEWAL",
            link: AppRoutes.BusinessDevelopment.reports.renewal,
            parentId: 302,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "MENUITEMS.PRODUCTION.TEXT",
    icon: "bx bx-layer",
    subItems: [
      {
        id: 401,
        label: "MENUITEMS.PRODUCTION.LIST.MANAGEMENT",
        link: AppRoutes.Production.base,
        parentId: 4,
      },
      {
        id: 402,
        label: "MENUITEMS.PRODUCTION.LIST.EDITCOMMISSIONS",
        link: AppRoutes.Production.editCommissions,
        parentId: 4,
      },
      {
        id: 403,
        label: "MENUITEMS.PRODUCTION.LIST.REPORTS",
        parentId: 4,
        subItems: [
          {
            id: 4001,
            label: "MENUITEMS.PRODUCTION.LIST.REPORTLIST.PRODUCTION",
            link: AppRoutes.Production.reports.production,
            parentId: 403,
          },
          {
            id: 4002,
            label: "MENUITEMS.PRODUCTION.LIST.REPORTLIST.RENEWAL",
            link: AppRoutes.Production.reports.renewal,
            parentId: 403,
          },
          {
            id: 4003,
            label: "MENUITEMS.PRODUCTION.LIST.REPORTLIST.RENEWALNOTICE",
            link: AppRoutes.Production.reports.renewalsNotice,
            parentId: 403,
          },
        ],
      },
      {
        id: 404,
        label: "MENUITEMS.PRODUCTION.LIST.ARCHIVES",
        parentId: 4,
        subItems: [
          {
            id: 4001,
            label: "MENUITEMS.PRODUCTION.LIST.ARCHIVESLIST.DCNOTES",
            link: AppRoutes.Production.archive.dcNote,
            parentId: 403,
          },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "MENUITEMS.CUSTOMERSERVICE.TEXT",
    icon: "ri-customer-service-2-line",
    subItems: [
      {
        id: 501,
        label: "MENUITEMS.CUSTOMERSERVICE.LIST.MANAGEMENT",
        link: AppRoutes.CustomerService.base,
        parentId: 5,
      },
      {
        id: 502,
        label: "MENUITEMS.CUSTOMERSERVICE.LIST.REPORTS",
        link: AppRoutes.CustomerService.reports,
        parentId: 5,
      },
    ],
  },
  {
    id: 6,
    label: "MENUITEMS.CLAIMS.TEXT",
    icon: "ri-file-copy-2-line",
    subItems: [
      {
        id: 601,
        label: "MENUITEMS.CLAIMS.LIST.MANAGEMENT",
        link: AppRoutes.Claims.base,
        parentId: 6,
      },
      {
        id: 602,
        label: "MENUITEMS.CLAIMS.LIST.REPORTS",
        link: AppRoutes.Claims.reports,
        parentId: 6,
      },
    ],
  },
  {
    id: 7,
    label: "MENUITEMS.SYSTEMADMIN.TEXT",
    icon: "ri-user-settings-line",
    subItems: [
      {
        id: 701,
        label: "MENUITEMS.SYSTEMADMIN.LIST.MANAGEMENT",
        link: AppRoutes.SystemAdmin.base,
        parentId: 7,
      },
    ],
  },
];
