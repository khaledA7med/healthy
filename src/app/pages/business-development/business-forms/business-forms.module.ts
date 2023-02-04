import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BusinessFormsComponent } from "./business-forms.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [{ path: "", component: BusinessFormsComponent }];

@NgModule({
  declarations: [BusinessFormsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class BusinessFormsModule {}
