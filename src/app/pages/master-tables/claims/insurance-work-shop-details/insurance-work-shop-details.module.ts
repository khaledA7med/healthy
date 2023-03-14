import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuranceWorkshopDetailsComponent } from './insurance-workshop-details/insurance-workshop-details.component';
import { InsuranceWorkshopDetailsFormsComponent } from './insurance-workshop-details/insurance-workshop-details-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: InsuranceWorkshopDetailsComponent },
];

@NgModule({
  declarations: [
    InsuranceWorkshopDetailsComponent,
    InsuranceWorkshopDetailsFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class InsuranceWorkShopDetailsModule { }
