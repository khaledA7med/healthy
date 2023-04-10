import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActiveListManagementComponent } from "./active-list-management.component";
import { RouterModule, Routes } from "@angular/router";
import { RangePickerModule } from "src/app/shared/components/range-picker/range-picker.module";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { PoilcyPreviewModule } from "src/app/shared/components/poilcy-preview/poilcy-preview.module";
import { ActiveListManagementControlsComponent } from "./active-list-management-controls.component";
import { ClientPolicyPreviewComponent } from "./client-policy-preview/client-policy-preview.component";
import { UploadExcelListComponent } from "./client-policy-preview/upload-excel-list/upload-excel-list.component";
import { GregorianPickerModule } from "src/app/shared/components/gregorian-picker/gregorian-picker.module";

export const routes: Routes = [{ path: "", component: ActiveListManagementComponent }];

@NgModule({
	declarations: [ActiveListManagementComponent, ActiveListManagementControlsComponent, ClientPolicyPreviewComponent, UploadExcelListComponent],
	imports: [CommonModule, RangePickerModule, RouterModule.forChild(routes), SharedModule, AgGridModule, PoilcyPreviewModule, GregorianPickerModule],
})
export class ActiveListManagementModule {}
