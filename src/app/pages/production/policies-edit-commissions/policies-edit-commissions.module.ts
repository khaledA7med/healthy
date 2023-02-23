import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciesEditCommissionsComponent } from './policies-edit-commissions.component';
import { PoliciesEditCommissionsControlsComponent } from './policies-edit-commissions-controls.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';

export const routes: Routes = [ { path: "", component: PoliciesEditCommissionsComponent } ];



@NgModule({
  declarations: [
    PoliciesEditCommissionsComponent,
    PoliciesEditCommissionsControlsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgGridModule.withComponents([ PoliciesEditCommissionsControlsComponent ]),
  ]
})
export class PoliciesEditCommissionsModule { }