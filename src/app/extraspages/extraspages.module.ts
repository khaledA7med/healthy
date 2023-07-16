import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Component pages
import { ExtrapagesRoutingModule } from "./extraspages-routing.module";
import { MaintenanceComponent } from "./maintenance/maintenance.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { Error401Component } from "./error401/error401.component";

@NgModule({
  declarations: [MaintenanceComponent, NotFoundComponent, Error401Component],
  imports: [CommonModule, ExtrapagesRoutingModule],
})
export class ExtraspagesModule {}
