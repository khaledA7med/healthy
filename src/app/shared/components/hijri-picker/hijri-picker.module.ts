import { NgModule } from "@angular/core";
import { CommonModule, JsonPipe } from "@angular/common";
import { HijriPickerComponent } from "./hijri-picker.component";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [HijriPickerComponent],
  imports: [CommonModule, NgbDatepickerModule, JsonPipe, FormsModule],
  exports: [HijriPickerComponent, NgbDatepickerModule, JsonPipe],
})
export class HijriPickerModule {}
