import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActiveListComponent } from "./active-list/active-list.component";
import { ActiveListControlsComponent } from "./active-list/active-list-controls.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { PoilcyPreviewModule } from "src/app/shared/components/poilcy-preview/poilcy-preview.module";
import { RangePickerModule } from "src/app/shared/components/range-picker/range-picker.module";
import { ActivePreviewModule } from "src/app/shared/components/medical-active-preview/active-preview.module";

export const routes: Routes = [{ path: "", component: ActiveListComponent }];

@NgModule({
  declarations: [ActiveListComponent, ActiveListControlsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgGridModule,
    PoilcyPreviewModule,
    RangePickerModule,
    ActivePreviewModule,
  ],
})
export class MedicalActiveListModule {}
