import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintsSettingsComponent } from './complaints-settings/complaints-settings.component';
import { ComplaintsSettingsFormsComponent } from './complaints-settings/complaints-settings-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [ { path: "", component: ComplaintsSettingsComponent } ];


@NgModule({
  declarations: [
    ComplaintsSettingsComponent,
    ComplaintsSettingsFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class ComplaintsSettingsModule { }
