import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarsMakeComponent } from './cars-make/cars-make.component';
import { CarsMakeFormsComponent } from './cars-make/cars-make-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [ { path: "", component: CarsMakeComponent } ];

@NgModule({
  declarations: [
    CarsMakeComponent,
    CarsMakeFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class CarsMakeModule { }
