import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesTypesComponent } from './vehicles-types/vehicles-types.component';
import { VehiclesTypesFormsComponent } from './vehicles-types/vehicles-types-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [ { path: "", component: VehiclesTypesComponent } ];


@NgModule({
  declarations: [
    VehiclesTypesComponent,
    VehiclesTypesFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule
  ]
})
export class VehiclesTypesModule { }
