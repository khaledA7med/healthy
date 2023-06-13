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
    ];
  }
}
