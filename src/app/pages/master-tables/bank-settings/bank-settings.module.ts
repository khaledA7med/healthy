import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankSettingsComponent } from './bank-settings/bank-settings.component';
import { BankSettingsFormsComponent } from './bank-settings/bank-settings-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [ { path: "", component: BankSettingsComponent } ];


@NgModule({
  declarations: [
    BankSettingsComponent,
    BankSettingsFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule
  ]
})
export class BankSettingsModule { }
