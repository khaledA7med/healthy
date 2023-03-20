import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProspectLossReasonsComponent } from "./prospect-loss-reasons/prospect-loss-reasons.component";
import { ProspectLossReasonsFormsComponent } from "./prospect-loss-reasons/prospect-loss-reasons-forms.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: ProspectLossReasonsComponent },
];

@NgModule({
  declarations: [
    ProspectLossReasonsComponent,
    ProspectLossReasonsFormsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ],
})
export class ProspectLossReasonsModule {}
