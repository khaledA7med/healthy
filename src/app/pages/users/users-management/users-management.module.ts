import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsersManagementComponent } from "./users-management.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { UsersManagementControlsComponent } from "./users-management-controls.component";
import { FormsModule } from "@angular/forms";

export const routes: Routes = [
  { path: "", component: UsersManagementComponent },
];

@NgModule({
  declarations: [UsersManagementComponent, UsersManagementControlsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgGridModule,
  ],
})
export class UsersManagementModule {}
