import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientReportsComponent } from "./client-reports.component";

import { RouterModule, Routes } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GregorianPickerModule } from "src/app/shared/components/gregorian-picker/gregorian-picker.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

export const routes: Routes = [ { path: "", component: ClientReportsComponent } ];

@NgModule({
  declarations: [ ClientReportsComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    GregorianPickerModule
  ],
})
export class ClientReportsModule { }
