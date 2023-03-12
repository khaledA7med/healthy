import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ClaimsRoutingModule } from "./claims-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { DashboardClaimsModule } from "./dashboard-claims/dashboard-claims.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClaimsRoutingModule,
    SharedModule,
    DashboardClaimsModule,
  ],
})
export class ClaimsModule {}
