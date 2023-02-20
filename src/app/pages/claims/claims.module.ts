import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ClaimsRoutingModule } from "./claims-routing.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, ClaimsRoutingModule, SharedModule],
})
export class ClaimsModule {}
