import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintsSettingsComponent } from './complaints-settings/complaints-settings.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [ { path: "", component: ComplaintsSettingsComponent } ];


@NgModule({
  declarations: [
    ComplaintsSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ComplaintsSettingsModule { }
