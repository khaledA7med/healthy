import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Component Pages
import { MaintenanceComponent } from "./maintenance/maintenance.component";
import { ComingSoonComponent } from "./coming-soon/coming-soon.component";
import { AppRoutes } from "../shared/app/routers/appRouters";
import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
  {
    path: "maintenance",
    component: MaintenanceComponent,
  },
  {
    path: "coming-soon",
    component: ComingSoonComponent,
  },
  {
    path: AppRoutes.Error.notFound,
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtrapagesRoutingModule {}
