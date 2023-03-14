import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimsGeneralItemsComponent } from './claims-general-items/claims-general-items.component';
import { ClaimsGeneralItemsFormsComponent } from './claims-general-items/claims-general-items-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: ClaimsGeneralItemsComponent },
];

@NgModule({
  declarations: [
    ClaimsGeneralItemsComponent,
    ClaimsGeneralItemsFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class ClaimsGeneralItemsModule { }
