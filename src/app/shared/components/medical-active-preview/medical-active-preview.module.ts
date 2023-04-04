import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MedicalActivePreviewComponent } from "./medical-active-preview/medical-active-preview.component";
import { SharedModule } from "../../shared.module";

@NgModule({
  declarations: [MedicalActivePreviewComponent],
  imports: [CommonModule, SharedModule],
})
export class MedicalActivePreviewModule {}
