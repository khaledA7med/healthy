import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomerServiceListComponent } from "./customer-service-list.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { CustomerServiceListControlsComponent } from './customer-service-list-controls.component';

export const routes: Routes = [
  { path: "", component: CustomerServiceListComponent },
];

@NgModule({
  declarations: [ CustomerServiceListComponent, CustomerServiceListControlsComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgGridModule.withComponents([ CustomerServiceListControlsComponent ]) ],
})
export class CustomerServiceListModule { }
