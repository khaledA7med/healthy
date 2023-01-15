import { Routes } from "@angular/router";
import { AppRoutes } from "./appRouters";

export const contents: Routes = [
  {
    path: AppRoutes.grid.index,
    loadChildren: () =>
      import(
        "../../../pages/extrapages/grid-general-implement/grid-general-implement.module"
      ).then((m) => m.GridGeneralImplementModule),
  },
];
