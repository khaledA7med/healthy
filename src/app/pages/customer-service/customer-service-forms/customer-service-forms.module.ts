import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomerServiceFormsComponent } from "./customer-service-forms.component";
import
{
  NgbAccordionModule,
  NgbCollapseModule,
} from "@ng-bootstrap/ng-bootstrap";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { DropzoneModule } from "src/app/shared/components/dropzone/dropzone.module";
import { GregorianPickerModule } from "src/app/shared/components/gregorian-picker/gregorian-picker.module";

export const routes: Routes = [
  { path: "", component: CustomerServiceFormsComponent },
];

@NgModule({
  declarations: [ CustomerServiceFormsComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgSelectModule,
    NgbAccordionModule,
    NgbCollapseModule,
    DropzoneModule,
    GregorianPickerModule, ],
})
export class CustomerServiceFormsModule { }
