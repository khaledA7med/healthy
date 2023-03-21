import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MODULES, MODULE_NAME } from "src/app/core/models/MODULES";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";
import { environment } from "src/environments/environment";
import { BaseData } from "../models/masterTableModels";
import { CachingService } from "./caching.service";

@Injectable({
  providedIn: "root",
})
export class MasterTableService {
  private dataSrc: { route: string; name: string }[];
  private readonly env: string = environment.baseURL;
  constructor(private http: HttpClient, private caching: CachingService) {
    this.dataSrc = [];
  }

  getBaseData(module: string) {
    let data = {
      LineOfBusiness: [
        {
          route: ApiRoutes.MasterTable.MasterTables.insurClasses,
          name: BaseData.InsurClasses,
        },
      ],
      InsuranceCompanies: [
        {
          route: ApiRoutes.MasterTable.MasterTables.insurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.Client.contactLineOfBusiness,
          name: BaseData.ContactLineOfBusiness,
        },
        {
          route: ApiRoutes.MasterTable.Client.contactDepartment,
          name: BaseData.ContactDepartment,
        },
      ],
      QuotingRequirements: [
        {
          route: ApiRoutes.MasterTable.MasterTables.insurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.MasterTables.insuranceComapnies,
          name: BaseData.InsuranceCompanies,
        },
      ],
      CustomerServiceDocuments: [
        {
          route: ApiRoutes.MasterTable.MasterTables.TypeOfCustomerServices,
          name: BaseData.TypeOfCustomerServices,
        },
        {
          route: ApiRoutes.MasterTable.MasterTables.insuranceComapnies,
          name: BaseData.InsuranceCompanies,
        },
      ],
      CustomerServiceRequirements: [
        {
          route: ApiRoutes.MasterTable.MasterTables.insuranceComapnies,
          name: BaseData.InsuranceCompanies,
        },
        {
          route: ApiRoutes.MasterTable.MasterTables.policyEndorsTypes,
          name: BaseData.PolicyEndorsTypes,
        },
        {
          route: ApiRoutes.MasterTable.MasterTables.insurClasses,
          name: BaseData.InsurClasses,
        },
      ],
      Hospitals: [
        {
          route: ApiRoutes.MasterTable.MasterTables.insuranceComapnies,
          name: BaseData.InsuranceCompanies,
        },
        {
          route: ApiRoutes.MasterTable.MasterTables.regions,
          name: BaseData.Regions,
        },
      ],
      ClaimsGeneralItems: [
        {
          route: ApiRoutes.MasterTable.MasterTables.insurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.MasterTables.lineOfBusiness,
          name: BaseData.LineOfBusiness,
        },
      ],
      ClaimsStatus: [
        {
          route: ApiRoutes.MasterTable.MasterTables.claimStatus,
          name: BaseData.ClaimStatus,
        },
      ],
      ClaimsRejectionReasons: [
        {
          route: ApiRoutes.MasterTable.MasterTables.TypeClaimsRejectionReason,
          name: BaseData.TypeClaimsRejectionReason,
        },
      ],
      MasterTableProductionLibraries: [
        {
          route: ApiRoutes.MasterTable.MasterTables.insurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.MasterTables.insuranceComapnies,
          name: BaseData.InsuranceCompanies,
        },
      ],
      MasterTableListOfRequiredDocuments: [
        {
          route: ApiRoutes.MasterTable.MasterTables.insurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.MasterTables.getPolicyTypeIssue,
          name: BaseData.GetPolicyTypeIssue,
        },
        {
          route: ApiRoutes.MasterTable.MasterTables.vehicleCarsMake,
          name: BaseData.VehicleCarsMake,
        },
      ],
      PolicyIssuanceRequirements: [
        {
          route: ApiRoutes.MasterTable.MasterTables.insurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.MasterTables.insuranceComapnies,
          name: BaseData.InsuranceCompanies,
        },
      ],
      DefaultEmails: [
        {
          route: ApiRoutes.MasterTable.MasterTables.CategoryOfDefaultEmail,
          name: BaseData.CategoryOfDefaultEmail,
        },
      ],
      Client: [
        {
          route: ApiRoutes.MasterTable.Client.clientType,
          name: BaseData.ClientType,
        },
        {
          route: ApiRoutes.MasterTable.Client.branch,
          name: BaseData.Branch,
        },
        {
          route: ApiRoutes.MasterTable.Client.producers,
          name: BaseData.Producers,
        },
        {
          route: ApiRoutes.MasterTable.Client.commericalNo,
          name: BaseData.CommericalNo,
        },
        {
          route: ApiRoutes.MasterTable.Client.groupsList,
          name: BaseData.GroupsList,
        },
        {
          route: ApiRoutes.MasterTable.Client.status,
          name: BaseData.ClientStatus,
        },
      ],
      ClientForm: [
        {
          route: ApiRoutes.MasterTable.Client.clientType,
          name: BaseData.ClientType,
        },
        {
          route: ApiRoutes.MasterTable.Client.producers,
          name: BaseData.Producers,
        },
        {
          route: ApiRoutes.MasterTable.Client.relationshipStatus,
          name: BaseData.RelationshipStatus,
        },
        {
          route: ApiRoutes.MasterTable.Client.businessType,
          name: BaseData.BusinessType,
        },
        {
          route: ApiRoutes.MasterTable.Client.channels,
          name: BaseData.Channels,
        },
        {
          route: ApiRoutes.MasterTable.Client.interface,
          name: BaseData.Interface,
        },
        {
          route: ApiRoutes.MasterTable.Client.screeningResult,
          name: BaseData.ScreeningResult,
        },
        {
          route: ApiRoutes.MasterTable.Client.nationalities,
          name: BaseData.Nationalities,
        },
        {
          route: ApiRoutes.MasterTable.Client.sourceofIncome,
          name: BaseData.SourceofIncome,
        },
        {
          route: ApiRoutes.MasterTable.Client.registrationStatus,
          name: BaseData.RegistrationStatus,
        },
        {
          route: ApiRoutes.MasterTable.Client.businessActivities,
          name: BaseData.BusinessActivities,
        },
        {
          route: ApiRoutes.MasterTable.Client.marketSegment,
          name: BaseData.MarketSegment,
        },
        {
          route: ApiRoutes.MasterTable.Client.premium,
          name: BaseData.Premium,
        },
        {
          route: ApiRoutes.MasterTable.Client.positions,
          name: BaseData.Positions,
        },
        {
          route: ApiRoutes.MasterTable.Client.branch,
          name: BaseData.Branch,
        },
        {
          route: ApiRoutes.MasterTable.Client.contactLineOfBusiness,
          name: BaseData.ContactLineOfBusiness,
        },
        {
          route: ApiRoutes.MasterTable.Client.contactDepartment,
          name: BaseData.ContactDepartment,
        },
        {
          route: ApiRoutes.MasterTable.Client.banks,
          name: BaseData.Banks,
        },
      ],
      BusinessDevelopmentForm: [
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.allClients,
          name: BaseData.AllClients,
        },
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.groupsList,
          name: BaseData.GroupsList,
        },
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.producers,
          name: BaseData.Producers,
        },
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.InsurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.InsuranceCompanyName,
          name: BaseData.InsuranceCompanyName,
        },
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.InsuranceBrokersList,
          name: BaseData.InsuranceBrokersList,
        },
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.logType,
          name: BaseData.LogType,
        },
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.branch,
          name: BaseData.Branch,
        },
      ],
      BusinessDevelopment: [
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.groupsList,
          name: BaseData.GroupsList,
        },
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.branch,
          name: BaseData.Branch,
        },
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.producers,
          name: BaseData.Producers,
        },
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.InsurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.AllUsers,
          name: BaseData.AllUsers,
        },
        {
          route: ApiRoutes.MasterTable.BusinessDevelopment.SalesleadStatus,
          name: BaseData.SalesleadStatus,
        },
        {
          route:
            ApiRoutes.MasterTable.BusinessDevelopment.prospectsReportsTypes,
          name: BaseData.ProspectsReportsTypes,
        },
      ],
      Production: [
        {
          route: ApiRoutes.MasterTable.Production.policyStatus,
          name: BaseData.PolicyStatus,
        },
        {
          route: ApiRoutes.MasterTable.Production.branch,
          name: BaseData.Branch,
        },
        {
          route: ApiRoutes.MasterTable.Production.policyEndorsTypes,
          name: BaseData.PolicyEndorsTypes,
        },
        {
          route: ApiRoutes.MasterTable.Production.clientsList,
          name: BaseData.ClientsList,
        },
        {
          route: ApiRoutes.MasterTable.Production.producers,
          name: BaseData.Producers,
        },
        {
          route: ApiRoutes.MasterTable.Production.insuranceCompanies,
          name: BaseData.InsuranceCompanies,
        },
        {
          route: ApiRoutes.MasterTable.Production.insurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.Production.allUsers,
          name: BaseData.AllUsers,
        },
        {
          route: ApiRoutes.MasterTable.Production.productionFieldList,
          name: BaseData.ProductionFieldList,
        },
        {
          route: ApiRoutes.MasterTable.Production.productionOperatordList,
          name: BaseData.ProductionOperatordList,
        },
      ],
      EditCommision: [
        {
          route: ApiRoutes.MasterTable.Production.producers,
          name: BaseData.Producers,
        },
        {
          route: ApiRoutes.MasterTable.Production.clientsList,
          name: BaseData.ClientsList,
        },
      ],
      ProductionForm: [
        {
          route: ApiRoutes.MasterTable.Production.producers,
          name: BaseData.Producers,
        },
        {
          route: ApiRoutes.MasterTable.Production.branch,
          name: BaseData.Branch,
        },
        {
          route: ApiRoutes.MasterTable.Production.insurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.Production.insuranceCompanies,
          name: BaseData.InsuranceCompanies,
        },
        {
          route: ApiRoutes.MasterTable.Production.policyEndorsTypes,
          name: BaseData.PolicyEndorsTypes,
        },
      ],
      CustomerService: [
        {
          route: ApiRoutes.MasterTable.CustomerService.AllClients,
          name: BaseData.AllClients,
        },
        {
          route: ApiRoutes.MasterTable.CustomerService.Branch,
          name: BaseData.Branch,
        },
        {
          route: ApiRoutes.MasterTable.CustomerService.InsuranceCompanies,
          name: BaseData.InsuranceCompanies,
        },
        {
          route: ApiRoutes.MasterTable.CustomerService.CServiceStatus,
          name: BaseData.CServiceStatus,
        },
        {
          route: ApiRoutes.MasterTable.CustomerService.PendingReason,
          name: BaseData.PendingReason,
        },
        {
          route: ApiRoutes.MasterTable.CustomerService.AllUsers,
          name: BaseData.AllUsers,
        },
        {
          route: ApiRoutes.MasterTable.CustomerService.InsurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.CustomerService.TypeOfCustomerServices,
          name: BaseData.TypeOfCustomerServices,
        },
      ],
      CustomerServiceForm: [
        {
          route: ApiRoutes.MasterTable.CustomerServiceForm.policyEndorsTypes,
          name: BaseData.PolicyEndorsTypes,
        },
        {
          route: ApiRoutes.MasterTable.CustomerServiceForm.allClients,
          name: BaseData.AllClients,
        },
        {
          route: ApiRoutes.MasterTable.CustomerServiceForm.insuranceCompanies,
          name: BaseData.InsuranceCompanies,
        },
        {
          route: ApiRoutes.MasterTable.CustomerServiceForm.vatPercentage,
          name: BaseData.VATPercentage,
        },
        {
          route: ApiRoutes.MasterTable.CustomerServiceForm.branch,
          name: BaseData.Branch,
        },
        {
          route: ApiRoutes.MasterTable.CustomerServiceForm.PendingReason,
          name: BaseData.PendingReason,
        },
        {
          route: ApiRoutes.MasterTable.CustomerServiceForm.PendingReason,
          name: BaseData.PendingReason,
        },
      ],
      Claims: [
        {
          route: ApiRoutes.MasterTable.Claims.allUsers,
          name: BaseData.AllUsers,
        },
        {
          route: ApiRoutes.MasterTable.Claims.claimStatus,
          name: BaseData.ClaimStatus,
        },
        {
          route: ApiRoutes.MasterTable.Claims.insuranceCompanies,
          name: BaseData.InsuranceCompanies,
        },
        {
          route: ApiRoutes.MasterTable.Claims.productionOperatordList,
          name: BaseData.ProductionOperatordList,
        },
        {
          route: ApiRoutes.MasterTable.Claims.typeOfCustomerServices,
          name: BaseData.TypeOfCustomerServices,
        },
        {
          route: ApiRoutes.MasterTable.CustomerServiceForm.PendingReason,
          name: BaseData.PendingReason,
        },
      ],
      ClaimsForm: [
        {
          route: ApiRoutes.MasterTable.Claims.insuranceCompanies,
          name: BaseData.InsuranceCompanies,
        },
        {
          route: ApiRoutes.MasterTable.Claims.insurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.Claims.currencies,
          name: BaseData.Currencies,
        },
        {
          route: ApiRoutes.MasterTable.Claims.banks,
          name: BaseData.Banks,
        },
        {
          route: ApiRoutes.MasterTable.Claims.claimStatus,
          name: BaseData.ClaimStatus,
        },
        {
          route: ApiRoutes.MasterTable.Claims.rejectionReasons,
          name: BaseData.RejectionReasons,
        },
        {
          route: ApiRoutes.MasterTable.Claims.claimCaseTypes,
          name: BaseData.ClaimCaseTypes,
        },
        {
          route: ApiRoutes.MasterTable.Claims.motorClaimTypes,
          name: BaseData.MotorClaimTypes,
        },
        {
          route: ApiRoutes.MasterTable.Claims.typesOfRepair,
          name: BaseData.TypesOfRepair,
        },
        {
          route: ApiRoutes.MasterTable.Claims.hospitals,
          name: BaseData.Hospitals,
        },
        {
          route: ApiRoutes.MasterTable.Claims.carsModels,
          name: BaseData.CarsModels,
        },
        {
          route: ApiRoutes.MasterTable.Claims.cities,
          name: BaseData.Cities,
        },
      ],
      SystemAdmin: [
        {
          route: ApiRoutes.MasterTable.SystemAdmin.statusOfUsers,
          name: BaseData.StatusOfUsers,
        },
        {
          route: ApiRoutes.MasterTable.SystemAdmin.jobTitleOfUsers,
          name: BaseData.JobTitleOfUsers,
        },
        {
          route: ApiRoutes.MasterTable.SystemAdmin.branch,
          name: BaseData.Branch,
        },
        {
          route: ApiRoutes.MasterTable.SystemAdmin.staffProfilesNames,
          name: BaseData.ProducersList,
        },
        {
          route: ApiRoutes.MasterTable.SystemAdmin.userSecurityRoles,
          name: BaseData.UserSecurityRoles,
        },
      ],
      Reports: [
        {
          route: ApiRoutes.MasterTable.Reports.clientsList,
          name: BaseData.ClientsList,
        },
        {
          route: ApiRoutes.MasterTable.Reports.groupsList,
          name: BaseData.GroupsList,
        },
        {
          route: ApiRoutes.MasterTable.Reports.InsurClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.Reports.insuranceCompanies,
          name: BaseData.InsuranceCompanies,
        },
        {
          route: ApiRoutes.MasterTable.Reports.branch,
          name: BaseData.Branch,
        },
        {
          route: ApiRoutes.MasterTable.Reports.producers,
          name: BaseData.Producers,
        },
        {
          route: ApiRoutes.MasterTable.Reports.policyEndorsTypes,
          name: BaseData.PolicyEndorsTypes,
        },
        {
          route: ApiRoutes.MasterTable.Reports.productionReportType,
          name: BaseData.ProductionReportType,
        },
        {
          route: ApiRoutes.MasterTable.Reports.productionReportBasedOn,
          name: BaseData.ProductionReportBasedOn,
        },
        {
          route: ApiRoutes.MasterTable.Reports.productionReportBasedOn,
          name: BaseData.ProductionReportCaptive,
        },
        {
          route: ApiRoutes.MasterTable.Reports.productionReportStatus,
          name: BaseData.ProductionReportStatus,
        },
        {
          route: ApiRoutes.MasterTable.Reports.renewalNoticeReportStatus,
          name: BaseData.RenewalNoticeReportStatus,
        },
        {
          route: ApiRoutes.MasterTable.Reports.cserviceStatus,
          name: BaseData.CServiceStatus,
        },
        {
          route: ApiRoutes.MasterTable.Reports.csReportType,
          name: BaseData.CSReportType,
        },
        {
          route: ApiRoutes.MasterTable.Reports.allUsers,
          name: BaseData.AllUsers,
        },
        {
          route: ApiRoutes.MasterTable.Reports.csReportStatus,
          name: BaseData.CSReportStatus,
        },
        {
          route: ApiRoutes.MasterTable.Claims.claimStatus,
          name: BaseData.ClaimStatus,
        },
        {
          route: ApiRoutes.MasterTable.Claims.rejectionReasons,
          name: BaseData.RejectionReasons,
        },
        {
          route: ApiRoutes.MasterTable.Reports.claimsReportType,
          name: BaseData.ClaimsReportType,
        },
      ],
    };

    switch (module) {
      case MODULES.Client:
        this.dataSrc = data.Client;
        break;
      case MODULES.ClientForm:
        this.dataSrc = data.ClientForm;
        break;
      case MODULES.BusinessDevelopment:
        this.dataSrc = data.BusinessDevelopment;
        break;
      case MODULES.BusinessDevelopmentForm:
        this.dataSrc = data.BusinessDevelopmentForm;
        break;
      case MODULES.ProductionForm:
        this.dataSrc = data.ProductionForm;
        break;
      case MODULES.Production:
        this.dataSrc = data.Production;
        break;
      case MODULES.EditCommission:
        this.dataSrc = data.EditCommision;
        break;
      case MODULES.CustomerService:
        this.dataSrc = data.CustomerService;
        break;
      case MODULES.CustomerServiceForm:
        this.dataSrc = data.CustomerServiceForm;
        break;
      case MODULES.Claims:
        this.dataSrc = data.Claims;
        break;
      case MODULES.ClaimsForm:
        this.dataSrc = data.ClaimsForm;
        break;
      case MODULES.SystemAdmin:
        this.dataSrc = data.SystemAdmin;
        break;
      case MODULES.LineOfBusiness:
        this.dataSrc = data.LineOfBusiness;
        break;
      case MODULES.InsuranceCompanies:
        this.dataSrc = data.InsuranceCompanies;
        break;
      case MODULES.QuotingRequirements:
        this.dataSrc = data.QuotingRequirements;
        break;
      case MODULES.PolicyIssuanceRequirements:
        this.dataSrc = data.PolicyIssuanceRequirements;
        break;
      case MODULES.InsuranceCompaniesDocuments:
        this.dataSrc = data.CustomerServiceDocuments;
        break;
      case MODULES.CustomerServiceCompanyRequirements:
        this.dataSrc = data.CustomerServiceRequirements;
        break;
      case MODULES.MasterTableProductionLibraries:
        this.dataSrc = data.MasterTableProductionLibraries;
        break;
      case MODULES.MasterTableListOfRequiredDocuments:
        this.dataSrc = data.MasterTableListOfRequiredDocuments;
        break;
      case MODULES.Hospitals:
        this.dataSrc = data.Hospitals;
        break;
      case MODULES.ClaimsGeneralItems:
        this.dataSrc = data.ClaimsGeneralItems;
        break;
      case MODULES.ClaimsStatus:
        this.dataSrc = data.ClaimsStatus;
        break;
      case MODULES.ClaimsRejectionReasons:
        this.dataSrc = data.ClaimsRejectionReasons;
        break;
      case MODULES.DefaultEmails:
        this.dataSrc = data.DefaultEmails;
        break;
      case MODULES.Reports:
        this.dataSrc = data.Reports;
        break;
      default:
        break;
    }

    for (let i = 0; i < this.dataSrc.length; i++) {
      this.http
        .get<any>(this.env + this.dataSrc[i].route, {
          context: new HttpContext().set(MODULE_NAME, this.dataSrc[i].name),
        })
        .subscribe();
    }
    return this.caching.getAll();
  }
}
