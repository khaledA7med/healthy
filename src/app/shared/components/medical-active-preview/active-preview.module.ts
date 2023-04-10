import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivePreviewComponent } from "./active-preview/active-preview.component";
import { SharedModule } from "../../shared.module";
import { UploadMedicalDataComponent } from "./upload-medical-data/upload-medical-data.component";
import { UploadMotorDataComponent } from './upload-motor-data/upload-motor-data.component';

@NgModule({
  declarations: [ActivePreviewComponent, UploadMedicalDataComponent, UploadMotorDataComponent],
  imports: [CommonModule, SharedModule],
})
export class ActivePreviewModule {}
