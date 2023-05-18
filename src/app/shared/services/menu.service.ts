import { Injectable } from "@angular/core";
import { MenuItem } from "src/app/layouts/sidebar/menu.model";
import { AppRoutes } from "../app/routers/appRouters";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  getMenu(): MenuItem[] {
    return [
      {
        id: 1,
        label: "MENUITEMS.HOME.TEXT",
        icon: "ri-home-4-line",
        link: AppRoutes.Home.base,
      },
      {
        id: 1,
        label: "MENUITEMS.INSURANCEPOLICY.TEXT",
        icon: "ri-file-list-3-line",
        link: AppRoutes.InsurancePolicy.base,
      },
      {
        id: 1,
        label: "MENUITEMS.REQUESTS.TEXT",
        icon: "ri-customer-service-2-line",
        link: AppRoutes.Requests.base,
      },
      {
        id: 1,
        label: "MENUITEMS.USERACCOUNTS.TEXT",
        icon: "ri-team-line",
        link: AppRoutes.UserAccounts.base,
      },
    ];
  }
}
