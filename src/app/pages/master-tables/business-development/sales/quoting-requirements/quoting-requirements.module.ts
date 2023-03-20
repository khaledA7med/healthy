import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QuotingRequirementsComponent } from "./quoting-requirements/quoting-requirements.component";
import { QuotingRequirementsFormsComponent } from "./quoting-requirements/quoting-requirements-forms.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: QuotingRequirementsComponent },
];

@NgModule({
  declarations: [
    QuotingRequirementsComponent,
    QuotingRequirementsFormsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ],
})
export class QuotingRequirementsModule {}
