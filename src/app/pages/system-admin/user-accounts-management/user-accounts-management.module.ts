import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserAccountsManagementComponent } from "./user-accounts-management.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { UserAccountsManagementControlsComponent } from "./user-accounts-management-controls.component";

export const routes: Routes = [
  { path: "", component: UserAccountsManagementComponent },
];

@NgModule({
  declarations: [
    UserAccountsManagementComponent,
    UserAccountsManagementControlsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgGridModule,
  ],
})
export class UserAccountsManagementModule {}
