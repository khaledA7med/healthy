import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClaimsFormsComponent } from "./claims-forms.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import {
  NgbAccordionModule,
  NgbCollapseModule,
} from "@ng-bootstrap/ng-bootstrap";
import { DropzoneModule } from "src/app/shared/components/dropzone/dropzone.module";
import { GregorianPickerModule } from "src/app/shared/components/gregorian-picker/gregorian-picker.module";

export const routes: Routes = [{ path: "", component: ClaimsFormsComponent }];

@NgModule({
  declarations: [ClaimsFormsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    NgbAccordionModule,
    NgbCollapseModule,
    DropzoneModule,
    GregorianPickerModule,
  ],
})
export class ClaimsFormsModule {}
