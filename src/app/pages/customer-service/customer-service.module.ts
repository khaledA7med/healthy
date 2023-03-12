import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomerServiceRoutingModule } from "./customer-service-routing.module";
import { DashboardCustomerServiceModule } from "./dashboard-customer-service/dashboard-customer-service.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomerServiceRoutingModule,
    DashboardCustomerServiceModule,
  ],
})
export class CustomerServiceModule {}
