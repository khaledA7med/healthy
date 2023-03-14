import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HospitalsComponent } from './hospitals/hospitals.component';
import { HospitalsFormsComponent } from './hospitals/hospitals-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [ { path: "", component: HospitalsComponent } ];

@NgModule({
  declarations: [
    HospitalsComponent,
    HospitalsFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class HospitalsModule { }
