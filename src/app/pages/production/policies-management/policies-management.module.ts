import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PoliciesManagementComponent } from "./policies-management.component";
import { PoliciesManagementControlsComponent } from "./policies-management-controls.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { RangePickerModule } from "src/app/shared/components/range-picker/range-picker.module";

export const routes: Routes = [
  { path: "", component: PoliciesManagementComponent },
];

@NgModule({
  declarations: [
    PoliciesManagementComponent,
    PoliciesManagementControlsComponent,
  ],
  imports: [
    CommonModule,
    RangePickerModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgGridModule,
  ],
})
export class PoliciesManagementModule {}
