import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PoilcyPreviewComponent } from "./poilcy-preview.component";
import { SharedModule } from "../../shared.module";

@NgModule({
  declarations: [PoilcyPreviewComponent],
  imports: [CommonModule, SharedModule],
})
export class PoilcyPreviewModule {}
