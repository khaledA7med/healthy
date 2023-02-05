import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomerServiceListComponent } from "./customer-service-list.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [
  { path: "", component: CustomerServiceListComponent },
];

@NgModule({
  declarations: [CustomerServiceListComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class CustomerServiceListModule {}
