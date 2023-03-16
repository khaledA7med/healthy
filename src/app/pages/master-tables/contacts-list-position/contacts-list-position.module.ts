import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsListPositionComponent } from './contacts-list-position/contacts-list-position.component';
import { ContactsListPositionFormsComponent } from './contacts-list-position/contacts-list-position-forms.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [ { path: "", component: ContactsListPositionComponent } ];


@NgModule({
  declarations: [
    ContactsListPositionComponent,
    ContactsListPositionFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule
  ]
})
export class ContactsListPositionModule { }
