import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyIssuanceRequirementsComponent } from './policy-issuance-requirements/policy-issuance-requirements.component';
import { PolicyIssuanceRequirementsFormsComponent } from './policy-issuance-requirements/policy-issuance-requirements-forms.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';

export const routes: Routes = [
  { path: "", component: PolicyIssuanceRequirementsComponent },
];

@NgModule({
  declarations: [
    PolicyIssuanceRequirementsComponent,
    PolicyIssuanceRequirementsFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class PolicyIssuanceRequirementsModule { }
