import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NewTaskComponent } from "./new-task.component";
import { SharedModule } from "../../shared.module";
import { RangePickerModule } from "../range-picker/range-picker.module";
import { FlatpickrModule } from "angularx-flatpickr";

@NgModule({
  declarations: [NewTaskComponent],
  imports: [
    CommonModule,
    SharedModule,
    RangePickerModule,
    FlatpickrModule.forRoot(),
  ],
  exports: [NewTaskComponent],
})
export class NewTaskModule {}
