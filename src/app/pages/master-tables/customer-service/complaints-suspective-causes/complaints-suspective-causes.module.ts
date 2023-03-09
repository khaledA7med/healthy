import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintsSuspectiveCausesComponent } from './complaints-suspective-causes/complaints-suspective-causes.component';
import { ComplaintsSuspectiveCausesFormsComponent } from './complaints-suspective-causes/complaints-suspective-causes-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [ { path: "", component: ComplaintsSuspectiveCausesComponent } ];


@NgModule({
  declarations: [
    ComplaintsSuspectiveCausesComponent,
    ComplaintsSuspectiveCausesFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class ComplaintsSuspectiveCausesModule { }
