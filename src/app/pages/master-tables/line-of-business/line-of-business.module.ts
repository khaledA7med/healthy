import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineOfBusinessComponent } from './line-of-business/line-of-business.component';
import { LineOfBusinessFormComponent } from './line-of-business/line-of-business-form.component';

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: LineOfBusinessComponent },
];

@NgModule({
  declarations: [
    LineOfBusinessComponent,
    LineOfBusinessFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes), AgGridModule.withComponents([ LineOfBusinessFormComponent ])
  ]
})
export class LineOfBusinessModule { }
