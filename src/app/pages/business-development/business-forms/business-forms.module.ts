import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BusinessFormsComponent } from "./business-forms.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import {
  NgbAccordionModule,
  NgbCollapseModule,
} from "@ng-bootstrap/ng-bootstrap";
import { GregorianPickerModule } from "src/app/shared/components/gregorian-picker/gregorian-picker.module";
import { DropzoneModule } from "src/app/shared/components/dropzone/dropzone.module";
import { RangePickerModule } from "src/app/shared/components/range-picker/range-picker.module";
export const routes: Routes = [{ path: "", component: BusinessFormsComponent }];

@NgModule({
  declarations: [BusinessFormsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgbAccordionModule,
    NgbCollapseModule,
    GregorianPickerModule,
    DropzoneModule,
    RangePickerModule,
  ],
})
export class BusinessFormsModule {}
