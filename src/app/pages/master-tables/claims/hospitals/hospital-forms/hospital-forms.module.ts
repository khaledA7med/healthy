import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { HospitalFormsComponent } from "./hospital-forms.component";

@NgModule({
  declarations: [HospitalFormsComponent],
  imports: [CommonModule, SharedModule],
})
export class HospitalFormsModule {}
