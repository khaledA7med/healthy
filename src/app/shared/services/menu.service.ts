import { Injectable } from "@angular/core";
import { IPrivileges } from "src/app/core/models/iuser";
import { ClaimsPermissions } from "src/app/core/roles/claims-permissions";
import { ClientsPermissions } from "src/app/core/roles/clients-permissions";
import { CustomerServicePermissions } from "src/app/core/roles/customer-service-permissions";
import { MasterTablePermissions } from "src/app/core/roles/master-table-permissions";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { MenuItem } from "src/app/layouts/sidebar/menu.model";
import { AppRoutes } from "../app/routers/appRouters";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  getMenu(privileges: IPrivileges): MenuItem[] {
    return [
      {
        id: 1,
        label: "MENUITEMS.MASTERTABLE.TEXT",
        icon: "ri-layout-grid-line",
        auth: privileges.MasterTables?.includes(
          MasterTablePermissions.ChMasterTabels
        ),
        subItems: [
          {
            id: 101,
            label: "MENUITEMS.MASTERTABLE.LIST.INSURANCECLASSES",
            link: AppRoutes.MasterTable.insuranceClasses,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChIncuranceClasses
            ),
          },
          {
            id: 102,
            label: "MENUITEMS.MASTERTABLE.LIST.LINEOFBUSINESS",
            link: AppRoutes.MasterTable.lineOfBusiness,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChIncuranceClasses
            ),
          },
          {
            id: 103,
            label: "MENUITEMS.MASTERTABLE.LIST.INSURANCECOMPANIES",
            link: AppRoutes.MasterTable.insuranceCompanies,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChInsuranceCompanies
            ),
          },
          {
            id: 104,
            label: "MENUITEMS.MASTERTABLE.LIST.INSURANCEBROKERS",
            link: AppRoutes.MasterTable.insuranceBrokers,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChInsuranceBrokers
            ),
          },
          {
            id: 105,
            label: "MENUITEMS.MASTERTABLE.LIST.POLICYTYPES",
            link: AppRoutes.MasterTable.policyTypes,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChMasterTabels
            ),
          },
          {
            id: 106,
            label: "MENUITEMS.MASTERTABLE.LIST.NATIONALITIES",
            link: AppRoutes.MasterTable.nationalities,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChMasterTabels
            ),
          },
          {
            id: 107,
            label: "MENUITEMS.MASTERTABLE.LIST.BUSINESSACTIVITY",
            link: AppRoutes.MasterTable.businessActivity,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChBusinessActivity
            ),
          },
          {
            id: 108,
            label: "MENUITEMS.MASTERTABLE.LIST.LEGALSTATUS",
            link: AppRoutes.MasterTable.legalStatus,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChMasterTabels
            ),
          },
          {
            id: 109,
            label: "MENUITEMS.MASTERTABLE.LIST.LOCATIONS",
            link: AppRoutes.MasterTable.locations,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChMasterTabels
            ),
          },
          {
            id: 110,
            label: "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.TEXT",
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChMasterTabels
            ),
            subItems: [
              {
                id: 1010,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.SALES.TEXT",
                parentId: 110,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChMasterTabels
                ),
                subItems: [
                  {
                    id: 10010,
                    label:
                      "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.SALES.QUOTINGREQUIREMENTS",
                    link: AppRoutes.MasterTable.businessDevelopment.Sales
                      .QuotingRequirements,
                    parentId: 1010,
                    auth: privileges.MasterTables?.includes(
                      MasterTablePermissions.ChMasterTabels
                    ),
                  },
                  {
                    id: 10011,
                    label:
                      "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.SALES.POLICYISSUANCEREQUIREMENTS",
                    link: AppRoutes.MasterTable.businessDevelopment.Sales
                      .PolicyIssuanceRequirements,
                    parentId: 1010,
                    auth: privileges.MasterTables?.includes(
                      MasterTablePermissions.ChMasterTabels
                    ),
                  },
                  {
                    id: 10012,
                    label:
                      "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.SALES.PROSPECTLOSSREASONS",
                    link: AppRoutes.MasterTable.businessDevelopment.Sales
                      .ProspectLossReasons,
                    parentId: 1010,
                    auth: privileges.MasterTables?.includes(
                      MasterTablePermissions.ChMasterTabels
                    ),
                  },
                ],
              },
              {
                id: 1011,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.CANCELLATION/REJECTIONREASONS.TEXT",
                parentId: 110,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChMasterTabels
                ),
                subItems: [
                  {
                    id: 10010,
                    label:
                      "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.CANCELLATION/REJECTIONREASONS.COMPANYREJECTIONREASONS",
                    link: AppRoutes.MasterTable.businessDevelopment
                      .CancellationRejectionReasons.CompanyRejectionReasons,
                    parentId: 1011,
                    auth: privileges.MasterTables?.includes(
                      MasterTablePermissions.ChMasterTabels
                    ),
                  },
                  {
                    id: 10011,
                    label:
                      "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.CANCELLATION/REJECTIONREASONS.CLIENTREJECTIONREASONS",
                    link: AppRoutes.MasterTable.businessDevelopment
                      .CancellationRejectionReasons.ClientRejectionReasons,
                    parentId: 1011,
                    auth: privileges.MasterTables?.includes(
                      MasterTablePermissions.ChMasterTabels
                    ),
                  },
                  {
                    id: 10012,
                    label:
                      "MENUITEMS.MASTERTABLE.LIST.BUSINESSDEVELOPMENT.CANCELLATION/REJECTIONREASONS.CANCELLATIONREASONS",
                    link: AppRoutes.MasterTable.businessDevelopment
                      .CancellationRejectionReasons.CancellationReasons,
                    parentId: 1011,
                    auth: privileges.MasterTables?.includes(
                      MasterTablePermissions.ChMasterTabels
                    ),
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
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChClientsCategories
            ),
          },
          {
            id: 112,
            label: "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.TEXT",
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChCustomerServiceModule
            ),
            subItems: [
              {
                id: 1012,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.INSURANCECOMPANIESDOCUMENTS",
                link: AppRoutes.MasterTable.customerService
                  .insuranceCompaniesDocuments,
                parentId: 112,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChCustomerServiceModule
                ),
              },
              {
                id: 1013,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.CUSTOMERSERVICEREQUIREMENTS",
                link: AppRoutes.MasterTable.customerService
                  .customerServiceRequirements,
                parentId: 112,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChCustomerServiceModule
                ),
              },
              {
                id: 1014,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.COMPLAINTSTYPES",
                link: AppRoutes.MasterTable.customerService.complaintsTypes,
                parentId: 112,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChCustomerServiceModule
                ),
              },
              {
                id: 1015,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.COMPLAINTSSETTINGS",
                link: AppRoutes.MasterTable.customerService.complaintsSettings,
                parentId: 112,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChCustomerServiceModule
                ),
              },
              {
                id: 1016,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.COMPLAINTSSUSPECTIVECAUSES",
                link: AppRoutes.MasterTable.customerService
                  .complaintsSuspectiveCauses,
                parentId: 112,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChCustomerServiceModule
                ),
              },
              {
                id: 1017,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.CUSTOMERSERVICE.CUSTOMERSERVICERECANCELLATIONREASONS",
                link: AppRoutes.MasterTable.customerService
                  .customerServiceCancellationReason,
                parentId: 112,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChCustomerServiceModule
                ),
              },
            ],
          },
          {
            id: 113,
            label: "MENUITEMS.MASTERTABLE.LIST.PRODUCTION.TEXT",
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChProductionBusinessModules
            ),
            subItems: [
              {
                id: 1013,
                label: "MENUITEMS.MASTERTABLE.LIST.PRODUCTION.LIBRARYOFCOVERS",
                link: AppRoutes.MasterTable.production.libraryOfCovers,
                parentId: 113,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChProductionBusinessModules
                ),
              },
              {
                id: 1014,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.PRODUCTION.LIBRARYOFINTERESTSINSURED",
                link: AppRoutes.MasterTable.production
                  .libraryOfInterestsInsured,
                parentId: 113,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChProductionBusinessModules
                ),
              },
              {
                id: 1015,
                label: "MENUITEMS.MASTERTABLE.LIST.PRODUCTION.LIBRARYOFTERMS",
                link: AppRoutes.MasterTable.production.libraryOfTerms,
                parentId: 113,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChProductionBusinessModules
                ),
              },
              {
                id: 1016,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.PRODUCTION.LIBRARYOFDEDUCTIBLES",
                link: AppRoutes.MasterTable.production.libraryOfDeductibles,
                parentId: 113,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChProductionBusinessModules
                ),
              },
              {
                id: 1017,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.PRODUCTION.LIBRARYOFEXCLUSIONS",
                link: AppRoutes.MasterTable.production.libraryOfExclusions,
                parentId: 113,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChProductionBusinessModules
                ),
              },
              {
                id: 1018,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.PRODUCTION.LIBRARYOFWARRANTIES",
                link: AppRoutes.MasterTable.production.libraryOfWarranties,
                parentId: 113,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChProductionBusinessModules
                ),
              },
              {
                id: 1019,
                label: "MENUITEMS.MASTERTABLE.LIST.PRODUCTION.LIFEPLAN",
                link: AppRoutes.MasterTable.production.lifePlan,
                parentId: 113,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChProductionBusinessModules
                ),
              },
              {
                id: 1020,
                label: "MENUITEMS.MASTERTABLE.LIST.PRODUCTION.VEHICLESMAKE",
                link: AppRoutes.MasterTable.production.vehiclesMake,
                parentId: 113,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChProductionBusinessModules
                ),
              },
              {
                id: 1021,
                label: "MENUITEMS.MASTERTABLE.LIST.PRODUCTION.VEHICLESTYPE",
                link: AppRoutes.MasterTable.production.vehiclesType,
                parentId: 113,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChProductionBusinessModules
                ),
              },
              {
                id: 1022,
                label: "MENUITEMS.MASTERTABLE.LIST.PRODUCTION.VEHICLESCOLOR",
                link: AppRoutes.MasterTable.production.vehiclesColor,
                parentId: 113,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChProductionBusinessModules
                ),
              },
            ],
          },
          {
            id: 114,
            label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.TEXT",
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChClaimsModule
            ),
            subItems: [
              {
                id: 1014,
                label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.CARSMAKE",
                link: AppRoutes.MasterTable.claims.carsMake,
                parentId: 114,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChClaimsModule
                ),
              },
              {
                id: 1015,
                label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.HOSPITALS",
                link: AppRoutes.MasterTable.claims.hospitals,
                parentId: 114,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChClaimsModule
                ),
              },
              {
                id: 1016,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.CLAIMS.INSURANCEWORKSHOPDETAILS",
                link: AppRoutes.MasterTable.claims.insuranceWorkShopDetails,
                parentId: 114,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChClaimsModule
                ),
              },
              {
                id: 1017,
                label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.TPALIST",
                link: AppRoutes.MasterTable.claims.tpaList,
                parentId: 114,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChClaimsModule
                ),
              },
              {
                id: 1018,
                label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.CLAIMSGENERALITEMS",
                link: AppRoutes.MasterTable.claims.claimsGeneralItems,
                parentId: 114,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChClaimsModule
                ),
              },
              {
                id: 1019,
                label: "MENUITEMS.MASTERTABLE.LIST.CLAIMS.CLAIMSSTATUS",
                link: AppRoutes.MasterTable.claims.claimsStatus,
                parentId: 114,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChClaimsModule
                ),
              },
              {
                id: 1020,
                label:
                  "MENUITEMS.MASTERTABLE.LIST.CLAIMS.CLAIMSREJECTIONREASONS",
                link: AppRoutes.MasterTable.claims.claimsRejectionReasons,
                parentId: 114,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChClaimsModule
                ),
              },
            ],
          },
          {
            id: 115,
            label: "MENUITEMS.MASTERTABLE.LIST.LISTOFDOCUMENTS.TEXT",
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChListOfRequiredDocuments
            ),
            subItems: [
              {
                id: 1015,
                label: "MENUITEMS.MASTERTABLE.LIST.LISTOFDOCUMENTS.CLIENTS",
                link: AppRoutes.MasterTable.listOfDocuments.clients,
                parentId: 115,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChListOfRequiredDocuments
                ),
              },
              {
                id: 1016,
                label: "MENUITEMS.MASTERTABLE.LIST.LISTOFDOCUMENTS.CLAIMS",
                link: AppRoutes.MasterTable.listOfDocuments.claims,
                parentId: 115,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChListOfRequiredDocuments
                ),
              },
              {
                id: 1017,
                label: "MENUITEMS.MASTERTABLE.LIST.LISTOFDOCUMENTS.PRODUCTION",
                link: AppRoutes.MasterTable.listOfDocuments.production,
                parentId: 115,
                auth: privileges.MasterTables?.includes(
                  MasterTablePermissions.ChListOfRequiredDocuments
                ),
              },
            ],
          },
          {
            id: 116,
            label: "MENUITEMS.MASTERTABLE.LIST.VEHICLESTYPES",
            link: AppRoutes.MasterTable.vehiclesTypes,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChMasterTabels
            ),
          },
          {
            id: 117,
            label: "MENUITEMS.MASTERTABLE.LIST.CONTACTSLISTPOSITION",
            link: AppRoutes.MasterTable.contactsListPosition,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChContactsListPosition
            ),
          },
          {
            id: 118,
            label: "MENUITEMS.MASTERTABLE.LIST.CITIES",
            link: AppRoutes.MasterTable.cities,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChCountries
            ),
          },
          {
            id: 119,
            label: "MENUITEMS.MASTERTABLE.LIST.DEFAULTEMAILS",
            link: AppRoutes.MasterTable.defaultEmails,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChDefaultEmails
            ),
          },
          {
            id: 120,
            label: "MENUITEMS.MASTERTABLE.LIST.BANKSETTINGS",
            link: AppRoutes.MasterTable.bankSettings,
            parentId: 1,
            auth: privileges.MasterTables?.includes(
              MasterTablePermissions.ChMasterTabels
            ),
          },
        ],
      },
      {
        id: 2,
        label: "MENUITEMS.CLIENTREGISTRY.TEXT",
        icon: "ri-folder-user-line",
        auth: privileges.Clients?.includes(
          ClientsPermissions.ChClientsRegistryAdmin
        ),
        subItems: [
          {
            id: 201,
            label: "MENUITEMS.CLIENTREGISTRY.LIST.CLIENTREGISTRY",
            link: AppRoutes.Client.clientRegistry,
            parentId: 2,
            auth: privileges.Clients?.includes(
              ClientsPermissions.ChClientsRegistry
            ),
          },
          {
            id: 202,
            label: "MENUITEMS.CLIENTREGISTRY.LIST.CLIENTGROUPS",
            link: AppRoutes.Client.groups,
            parentId: 2,
            auth: privileges.Clients?.includes(
              ClientsPermissions.ChClientsGrouping
            ),
          },
          {
            id: 203,
            label: "MENUITEMS.CLIENTREGISTRY.LIST.REPORTS",
            link: AppRoutes.Client.reports,
            parentId: 2,
            auth: privileges.Clients?.includes(
              ClientsPermissions.ChClientsRegistryAdmin
            ),
          },
        ],
      },
      {
        id: 3,
        label: "MENUITEMS.BUSINESSDEVELOPMENT.TEXT",
        icon: "ri-briefcase-5-line",
        auth: true,
        subItems: [
          {
            id: 301,
            label: "MENUITEMS.BUSINESSDEVELOPMENT.LIST.DASHBOARD",
            link: AppRoutes.BusinessDevelopment.dashboard,
            parentId: 3,
            auth: true,
          },
          {
            id: 302,
            label: "MENUITEMS.BUSINESSDEVELOPMENT.LIST.MANAGEMENT",
            link: AppRoutes.BusinessDevelopment.management,
            parentId: 3,
            auth: true,
          },
          {
            id: 302,
            label: "MENUITEMS.BUSINESSDEVELOPMENT.LIST.REPORTS",
            parentId: 3,
            auth: true,
            subItems: [
              {
                id: 3001,
                label:
                  "MENUITEMS.BUSINESSDEVELOPMENT.LIST.REPORTLIST.BUSINESSDEVELOPMENT",
                link: AppRoutes.BusinessDevelopment.reports.business,
                parentId: 302,
                auth: true,
              },
              {
                id: 3002,
                label: "MENUITEMS.BUSINESSDEVELOPMENT.LIST.REPORTLIST.RENEWAL",
                link: AppRoutes.BusinessDevelopment.reports.renewal,
                parentId: 302,
                auth: true,
              },
            ],
          },
        ],
      },
      {
        id: 4,
        label: "MENUITEMS.PRODUCTION.TEXT",
        icon: "bx bx-layer",
        auth: privileges.Production?.includes(
          ProductionPermissions.ChProduction
        ),
        subItems: [
          {
            id: 401,
            label: "MENUITEMS.PRODUCTION.LIST.MANAGEMENT",
            link: AppRoutes.Production.base,
            parentId: 4,
            auth: privileges.Production?.includes(
              ProductionPermissions.ChProdPolicies
            ),
          },
          {
            id: 402,
            label: "MENUITEMS.PRODUCTION.LIST.ACTIVELISTMANAGEMENT",
            link: AppRoutes.Production.activeList,
            parentId: 4,
            auth: privileges.Production?.includes(
              ProductionPermissions.ChProdPolicies
            ),
          },
          {
            id: 403,
            label: "MENUITEMS.PRODUCTION.LIST.EDITCOMMISSIONS",
            link: AppRoutes.Production.editCommissions,
            parentId: 4,
            auth: privileges.Production?.includes(
              ProductionPermissions.ChChangeProducerComm
            ),
          },
          {
            id: 404,
            label: "MENUITEMS.PRODUCTION.LIST.REPORTS",
            parentId: 4,
            auth: privileges.Production?.includes(
              ProductionPermissions.ChProdReports
            ),
            subItems: [
              {
                id: 4001,
                label: "MENUITEMS.PRODUCTION.LIST.REPORTLIST.PRODUCTION",
                link: AppRoutes.Production.reports.production,
                parentId: 404,
                auth: true,
              },
              {
                id: 4002,
                label: "MENUITEMS.PRODUCTION.LIST.REPORTLIST.RENEWAL",
                link: AppRoutes.Production.reports.renewal,
                parentId: 404,
                auth: true,
              },
              {
                id: 4003,
                label: "MENUITEMS.PRODUCTION.LIST.REPORTLIST.RENEWALNOTICE",
                link: AppRoutes.Production.reports.renewalsNotice,
                parentId: 404,
                auth: true,
              },
            ],
          },
          {
            id: 405,
            label: "MENUITEMS.PRODUCTION.LIST.ARCHIVES",
            parentId: 4,
            auth: privileges.Production?.includes(
              ProductionPermissions.ChProdReports
            ),
            subItems: [
              {
                id: 4001,
                label: "MENUITEMS.PRODUCTION.LIST.ARCHIVESLIST.DCNOTES",
                link: AppRoutes.Production.reports.archive.dcNote,
                parentId: 405,
                auth: true,
              },
            ],
          },
        ],
      },
      {
        id: 5,
        label: "MENUITEMS.CUSTOMERSERVICE.TEXT",
        icon: "ri-customer-service-2-line",
        auth: privileges.CustomerService?.includes(
          CustomerServicePermissions.ChCustomerService
        ),
        subItems: [
          {
            id: 501,
            label: "MENUITEMS.CUSTOMERSERVICE.LIST.MANAGEMENT",
            link: AppRoutes.CustomerService.base,
            parentId: 5,
            auth: privileges.CustomerService?.includes(
              CustomerServicePermissions.ChRequestsManagements
            ),
          },
          {
            id: 502,
            label: "MENUITEMS.CUSTOMERSERVICE.LIST.REPORTS",
            link: AppRoutes.CustomerService.reports,
            parentId: 5,
            auth: privileges.CustomerService?.includes(
              CustomerServicePermissions.ChCustSerReports
            ),
          },
        ],
      },
      {
        id: 6,
        label: "MENUITEMS.CLAIMS.TEXT",
        icon: "ri-file-copy-2-line",
        auth: privileges.Claims?.includes(ClaimsPermissions.ChClaims),
        subItems: [
          {
            id: 601,
            label: "MENUITEMS.CLAIMS.LIST.MANAGEMENT",
            link: AppRoutes.Claims.base,
            parentId: 6,
            auth: privileges.Claims?.includes(
              ClaimsPermissions.ChClaimsManagement
            ),
          },
          {
            id: 602,
            label: "MENUITEMS.CLAIMS.LIST.REPORTS",
            link: AppRoutes.Claims.reports,
            parentId: 6,
            auth: privileges.Claims?.includes(ClaimsPermissions.ChClaimsReport),
          },
        ],
      },
      {
        id: 7,
        label: "MENUITEMS.SYSTEMADMIN.TEXT",
        icon: "ri-user-settings-line",
        auth: true,
        subItems: [
          {
            id: 701,
            label: "MENUITEMS.SYSTEMADMIN.LIST.MANAGEMENT",
            link: AppRoutes.SystemAdmin.base,
            parentId: 7,
            auth: true,
          },
        ],
      },
    ];
  }
}
