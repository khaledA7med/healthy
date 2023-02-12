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
          route: ApiRoutes.MasterTable.Production.insuranceClasses,
          name: BaseData.InsurClasses,
        },
        {
          route: ApiRoutes.MasterTable.Production.insuranceCompanies,
          name: BaseData.InsuranceCompanies,
        },
        {
          route: ApiRoutes.MasterTable.Production.endorsTypes,
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
      case MODULES.ProductionForm:
        this.dataSrc = data.ProductionForm;
        break;
      case MODULES.CustomerService:
        this.dataSrc = data.CustomerService;
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
