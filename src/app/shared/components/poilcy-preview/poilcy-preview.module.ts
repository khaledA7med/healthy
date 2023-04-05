import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PoilcyPreviewComponent } from "./poilcy-preview.component";
import { SharedModule } from "../../shared.module";
import { UploadExcelListComponent } from "./upload-excel-list/upload-excel-list.component";
import { AgGridModule } from "ag-grid-angular";

@NgModule({
	declarations: [PoilcyPreviewComponent, UploadExcelListComponent],
	imports: [CommonModule, SharedModule, AgGridModule],
})
export class PoilcyPreviewModule {}
