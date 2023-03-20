import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClaimsRejectionReasonsComponent } from "./claims-rejection-reasons/claims-rejection-reasons.component";
import { ClaimsRejectionReasonsFormsComponent } from "./claims-rejection-reasons/claims-rejection-reasons-forms.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: ClaimsRejectionReasonsComponent },
];

@NgModule({
  declarations: [
    ClaimsRejectionReasonsComponent,
    ClaimsRejectionReasonsFormsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ],
})
export class ClaimsRejectionReasonsModule {}
