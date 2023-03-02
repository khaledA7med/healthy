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
            link: AppRoutes.BusinessDevelopment.Reports.Business,
            parentId: 302,
          },
          {
            id: 3002,
            label: "MENUITEMS.BUSINESSDEVELOPMENT.LIST.REPORTLIST.RENEWAL",
            link: AppRoutes.BusinessDevelopment.Reports.Renewal,
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
