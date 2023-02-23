import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: AppRoutes.Email.base,
    data: { title: "Emails" },
    loadChildren: () =>
      import("./email-list/email-list.module").then((m) => m.EmailListModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailRoutingModule {}
