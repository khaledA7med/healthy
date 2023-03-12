import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerServiceRequirementsComponent } from './customer-service-requirements/customer-service-requirements.component';
import { CustomerServiceRequirementsFormsComponent } from './customer-service-requirements/customer-service-requirements-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [ { path: "", component: CustomerServiceRequirementsComponent } ];


@NgModule({
  declarations: [
    CustomerServiceRequirementsComponent,
    CustomerServiceRequirementsFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class CustomerServiceRequirementsModule { }
