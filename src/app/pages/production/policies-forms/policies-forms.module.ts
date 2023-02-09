import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PoliciesFormsComponent } from "./policies-forms.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DropzoneModule } from "src/app/shared/components/dropzone/dropzone.module";
import { RangePickerModule } from "src/app/shared/components/range-picker/range-picker.module";
import { AgGridModule } from "ag-grid-angular";
import { PolicyRequestsListComponent } from "./policy-requests-list.component";
import { GregorianPickerModule } from "src/app/shared/components/gregorian-picker/gregorian-picker.module";

export const routes: Routes = [{ path: "", component: PoliciesFormsComponent }];

@NgModule({
  declarations: [PoliciesFormsComponent, PolicyRequestsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    DropzoneModule,
    RangePickerModule,
    AgGridModule,
    GregorianPickerModule,
  ],
})
export class PoliciesFormsModule {}
