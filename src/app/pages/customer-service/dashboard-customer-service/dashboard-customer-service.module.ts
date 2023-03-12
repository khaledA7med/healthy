import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardCustomerServiceComponent } from "./dashboard-customer-service.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { AgChartsAngularModule } from "ag-charts-angular";

export const routes: Routes = [
  { path: "", component: DashboardCustomerServiceComponent },
];

@NgModule({
  declarations: [DashboardCustomerServiceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgGridModule,
    AgChartsAngularModule,
  ],
})
export class DashboardCustomerServiceModule {}
