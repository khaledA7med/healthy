import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivePreviewComponent } from "./active-preview/active-preview.component";
import { SharedModule } from "../../shared.module";
import { UploadMedicalDataComponent } from "./active-preview/upload-medical-data/upload-medical-data.component";
import { UploadMotorDataComponent } from "./active-preview/upload-motor-data/upload-motor-data.component";
import { GregorianPickerModule } from "../gregorian-picker/gregorian-picker.module";

@NgModule({
  declarations: [
    ActivePreviewComponent,
    UploadMedicalDataComponent,
    UploadMotorDataComponent,
  ],
  imports: [CommonModule, SharedModule, GregorianPickerModule],
})
export class ActivePreviewModule {}
