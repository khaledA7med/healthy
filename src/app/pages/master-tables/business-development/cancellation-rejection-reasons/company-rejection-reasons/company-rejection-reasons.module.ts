import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyRejectionReasonsComponent } from './company-rejection-reasons/company-rejection-reasons.component';
import { CompanyRejectionReasonsFormsComponent } from './company-rejection-reasons/company-rejection-reasons-forms.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';

export const routes: Routes = [
  { path: "", component: CompanyRejectionReasonsComponent },
];

@NgModule({
  declarations: [
    CompanyRejectionReasonsComponent,
    CompanyRejectionReasonsFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class CompanyRejectionReasonsModule { }
