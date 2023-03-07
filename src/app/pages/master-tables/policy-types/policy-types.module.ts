import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyTypesComponent } from './policy-types/policy-types.component';
import { PolicyTypesFromsComponent } from './policy-types/policy-types-froms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: PolicyTypesComponent },
];

@NgModule({
  declarations: [
    PolicyTypesComponent,
    PolicyTypesFromsComponent
  ],
  imports: [
    CommonModule, SharedModule, RouterModule.forChild(routes), AgGridModule.withComponents([ PolicyTypesFromsComponent ])
  ]
})
export class PolicyTypesModule { }
