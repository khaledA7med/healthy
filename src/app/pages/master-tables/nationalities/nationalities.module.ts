import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NationalitiesComponent } from './nationalities/nationalities.component';
import { NationalitiesFormsComponent } from './nationalities/nationalities-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [ { path: "", component: NationalitiesComponent } ];


@NgModule({
  declarations: [
    NationalitiesComponent,
    NationalitiesFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class NationalitiesModule { }
