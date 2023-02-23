import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LayoutComponent } from "./layouts/layout.component";

// Auth
import { AuthGuard } from "./core/guards/auth.guard";
import { NotFoundComponent } from "./extraspages/not-found/not-found.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
    canActivate: [AuthGuard],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./account/account.module").then((m) => m.AccountModule),
  },
  {
    path: "pages",
    loadChildren: () =>
      import("./extraspages/extraspages.module").then(
        (m) => m.ExtraspagesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
  {
    path: "",
    redirectTo: "/",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
