import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardBusinessDevelopmentComponent } from "./dashboard-business-development.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { AgChartsAngularModule } from "ag-charts-angular";

export const routes: Routes = [
  { path: "", component: DashboardBusinessDevelopmentComponent },
];

@NgModule({
  declarations: [DashboardBusinessDevelopmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgGridModule,
    AgChartsAngularModule,
  ],
})
export class DashboardBusinessDevelopmentModule {}
