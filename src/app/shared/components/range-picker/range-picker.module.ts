import { NgModule } from "@angular/core";
import { CommonModule, JsonPipe } from "@angular/common";
import { RangePickerComponent } from "./range-picker.component";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [RangePickerComponent],
  imports: [CommonModule, JsonPipe, NgbDatepickerModule],
  exports: [RangePickerComponent, JsonPipe, NgbDatepickerModule],
})
export class RangePickerModule {}
