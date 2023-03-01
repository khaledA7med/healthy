import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InsuranceClassesComponent } from "./insurance-classes/insurance-classes.component";
import { InsuranceClassesFormComponent } from "./insurance-classes/insurance-classes-form.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [
  { path: "", component: InsuranceClassesComponent },
];

@NgModule({
  declarations: [InsuranceClassesComponent, InsuranceClassesFormComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class InsuranceClassesModule {}
