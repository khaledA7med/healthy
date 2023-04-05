import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActiveListManagementComponent } from "./active-list-management.component";
import { RouterModule, Routes } from "@angular/router";
import { RangePickerModule } from "src/app/shared/components/range-picker/range-picker.module";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { PoilcyPreviewModule } from "src/app/shared/components/poilcy-preview/poilcy-preview.module";
import { ActiveListManagementControlsComponent } from "./active-list-management-controls.component";

export const routes: Routes = [{ path: "", component: ActiveListManagementComponent }];

@NgModule({
	declarations: [ActiveListManagementComponent, ActiveListManagementControlsComponent],
	imports: [CommonModule, RangePickerModule, RouterModule.forChild(routes), SharedModule, AgGridModule, PoilcyPreviewModule],
})
export class ActiveListManagementModule {}
