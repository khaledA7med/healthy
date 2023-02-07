import { NgModule } from "@angular/core";
import { CommonModule, JsonPipe } from "@angular/common";
import { AppRangePickerComponent } from "./app-range-picker.component";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
	imports: [CommonModule, JsonPipe, NgbDatepickerModule],
	declarations: [AppRangePickerComponent],
	exports: [AppRangePickerComponent, JsonPipe, NgbDatepickerModule],
})
export class AppRangePickerModule {}
