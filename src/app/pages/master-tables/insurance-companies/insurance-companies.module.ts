import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuranceCompaniesComponent } from './insurance-companies/insurance-companies.component';
import { InsuranceCompaniesFormsComponent } from './insurance-companies/insurance-companies-forms.component';
import { AgGridModule } from 'ag-grid-angular';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

export const routes: Routes = [
  { path: "", component: InsuranceCompaniesComponent },
];

@NgModule({
  declarations: [
    InsuranceCompaniesComponent,
    InsuranceCompaniesFormsComponent
  ],
  imports: [
    CommonModule, SharedModule, RouterModule.forChild(routes), AgGridModule.withComponents([ InsuranceCompaniesFormsComponent ])
  ]
})
export class InsuranceCompaniesModule { }
