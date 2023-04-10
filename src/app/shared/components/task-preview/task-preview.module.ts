import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.module";
import { RangePickerModule } from "../range-picker/range-picker.module";
import { FlatpickrModule } from "angularx-flatpickr";
import { TaskPreviewComponent } from "./task-preview.component";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [TaskPreviewComponent],
  imports: [
    CommonModule,
    SharedModule,
    RangePickerModule,
    FlatpickrModule.forRoot(),
    NgbCollapseModule,
  ],
  exports: [TaskPreviewComponent],
})
export class TaskPreviewModule {}
