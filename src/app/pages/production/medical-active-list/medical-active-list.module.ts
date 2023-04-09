import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MedicalActiveListComponent } from "./medical-active-list/medical-active-list.component";
import { MedicalActiveListControlsComponent } from "./medical-active-list/medical-active-list-controls.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { MedicalActivePreviewModule } from "src/app/shared/components/medical-active-preview/medical-active-preview.module";
import { PoilcyPreviewModule } from "src/app/shared/components/poilcy-preview/poilcy-preview.module";
import { RangePickerModule } from "src/app/shared/components/range-picker/range-picker.module";

export const routes: Routes = [
  { path: "", component: MedicalActiveListComponent },
];

@NgModule({
  declarations: [
    MedicalActiveListComponent,
    MedicalActiveListControlsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgGridModule,
    MedicalActivePreviewModule,
    PoilcyPreviewModule,
    RangePickerModule,
  ],
})
export class MedicalActiveListModule {}
