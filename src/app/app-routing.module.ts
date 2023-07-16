import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { LayoutComponent } from "./layouts/layout.component";

// Auth
import { AuthGuard } from "./core/guards/auth.guard";
import { NotFoundComponent } from "./extraspages/not-found/not-found.component";
import { AppRoutes } from "./shared/app/routers/appRouters";
import { UnAuthGuard } from "./core/guards/un-auth.guard";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
    // canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.Auth.login,
    loadChildren: () =>
      import("./account/account.module").then((m) => m.AccountModule),
    // canActivate: [UnAuthGuard],
  },
  {
    path: "",
    loadChildren: () =>
      import("./extraspages/extraspages.module").then(
        (m) => m.ExtraspagesModule
      ),
    // canActivate: [AuthGuard],
  },
  {
    path: "",
    redirectTo: "/",
    pathMatch: "full",
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
