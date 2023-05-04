import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PoilcyPreviewComponent } from "./poilcy-preview.component";
import { SharedModule } from "../../shared.module";
import { AgGridModule } from "ag-grid-angular";

@NgModule({
	declarations: [PoilcyPreviewComponent],
	imports: [CommonModule, SharedModule, AgGridModule],
})
export class PoilcyPreviewModule {}
