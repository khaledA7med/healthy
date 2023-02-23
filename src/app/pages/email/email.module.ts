import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EmailRoutingModule } from "./email-routing.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, EmailRoutingModule, SharedModule],
})
export class EmailModule {}
