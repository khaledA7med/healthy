import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule, Routes } from "@angular/router";
import { ClientGroupComponent } from "./client-group.component";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [{ path: "", component: ClientGroupComponent }];

@NgModule({
  declarations: [ClientGroupComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class ClientGroupModule {}
