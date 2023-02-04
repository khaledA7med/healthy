import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BusinessDevelopmentManagementComponent } from "./business-development-management.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DragulaModule } from "ng2-dragula";

export const routes: Routes = [
  { path: "", component: BusinessDevelopmentManagementComponent },
];

@NgModule({
  declarations: [BusinessDevelopmentManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    DragulaModule,
  ],
})
export class BusinessDevelopmentManagementModule {}
