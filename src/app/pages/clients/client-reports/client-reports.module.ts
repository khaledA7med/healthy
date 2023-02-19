import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientReportsComponent } from "./client-reports.component";

import { RouterModule, Routes } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDatepickerModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";

export const routes: Routes = [ { path: "", component: ClientReportsComponent } ];

@NgModule({
  declarations: [ ClientReportsComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbModule
  ],
})
export class ClientReportsModule { }
