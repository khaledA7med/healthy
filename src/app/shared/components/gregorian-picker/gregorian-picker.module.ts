import { GregorianPickerComponent } from "./gregorian-picker.component";
import { NgModule } from "@angular/core";
import { CommonModule, JsonPipe } from "@angular/common";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [GregorianPickerComponent],
  imports: [CommonModule, NgbDatepickerModule, FormsModule, JsonPipe],
  exports: [GregorianPickerComponent, NgbDatepickerModule, JsonPipe],
})
export class GregorianPickerModule {}
