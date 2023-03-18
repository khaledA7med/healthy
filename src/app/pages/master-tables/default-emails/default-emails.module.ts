import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultEmailsComponent } from './default-emails/default-emails.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: DefaultEmailsComponent },
];


@NgModule({
  declarations: [
    DefaultEmailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule
  ]
})
export class DefaultEmailsModule { }
