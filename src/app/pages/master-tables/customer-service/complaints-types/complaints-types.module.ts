import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComplaintsTypesComponent } from "./complaints-types/complaints-types.component";
import { ComplaintsTypesFormsComponent } from "./complaints-types/complaints-types-forms.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: ComplaintsTypesComponent },
];

@NgModule({
  declarations: [ComplaintsTypesComponent, ComplaintsTypesFormsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ],
})
export class ComplaintsTypesModule {}
