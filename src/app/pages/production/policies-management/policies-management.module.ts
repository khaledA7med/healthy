import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PoliciesManagementComponent } from "./policies-management.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [
  { path: "", component: PoliciesManagementComponent },
];

@NgModule({
  declarations: [PoliciesManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class PoliciesManagementModule {}
