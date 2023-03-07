import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InsuranceBrokersComponent } from "./insurance-brokers/insurance-brokers.component";
import { InsuranceBrokersFormsComponent } from "./insurance-brokers/insurance-brokers-forms.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: InsuranceBrokersComponent },
];

@NgModule({
  declarations: [InsuranceBrokersComponent, InsuranceBrokersFormsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ],
})
export class InsuranceBrokersModule {}
