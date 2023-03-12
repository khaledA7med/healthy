import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardClaimsComponent } from "./dashboard-claims.component";
import { AgGridModule } from "ag-grid-angular";
import { AgChartsAngularModule } from "ag-charts-angular";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [DashboardClaimsComponent],
  imports: [CommonModule, SharedModule, AgGridModule, AgChartsAngularModule],
})
export class DashboardClaimsModule {}
