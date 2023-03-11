import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessActivityComponent } from './business-activity/business-activity.component';
import { BusinessActivityFormsComponent } from './business-activity/business-activity-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [ { path: "", component: BusinessActivityComponent } ];

@NgModule({
  declarations: [
    BusinessActivityComponent,
    BusinessActivityFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class BusinessActivityModule { }
