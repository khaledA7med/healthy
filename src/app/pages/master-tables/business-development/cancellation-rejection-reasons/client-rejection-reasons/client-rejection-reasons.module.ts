import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientRejectionReasonsComponent } from "./client-rejection-reasons/client-rejection-reasons.component";
import { ClientRejectionReasonsFormsComponent } from "./client-rejection-reasons/client-rejection-reasons-forms.component";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: ClientRejectionReasonsComponent },
];

@NgModule({
  declarations: [
    ClientRejectionReasonsComponent,
    ClientRejectionReasonsFormsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ],
})
export class ClientRejectionReasonsModule {}
