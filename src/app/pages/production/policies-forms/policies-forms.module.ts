import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PoliciesFormsComponent } from "./policies-forms.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DropzoneModule } from "src/app/shared/components/dropzone/dropzone.module";

export const routes: Routes = [{ path: "", component: PoliciesFormsComponent }];

@NgModule({
  declarations: [PoliciesFormsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    DropzoneModule,
  ],
})
export class PoliciesFormsModule {}
