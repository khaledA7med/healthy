import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimsStatusComponent } from './claims-status/claims-status.component';
import { ClaimsStatusFormsComponent } from './claims-status/claims-status-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: ClaimsStatusComponent },
];

@NgModule({
  declarations: [
    ClaimsStatusComponent,
    ClaimsStatusFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class ClaimsStatusModule { }
