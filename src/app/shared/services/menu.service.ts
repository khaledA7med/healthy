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
        subItems: [
          {
            id: 101,
            label: "MENUITEMS.HOME.LIST.GETALLSHIPMENTS",
            link: AppRoutes.Home.getAllShipments,
            parentId: 1,
          },
          {
            id: 102,
            label: "MENUITEMS.HOME.LIST.ABOUT",
            link: AppRoutes.Home.about,
            parentId: 1,
          },
        ],
      },
    ];
  }
}
