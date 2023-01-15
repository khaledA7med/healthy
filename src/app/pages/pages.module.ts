import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FlatpickrModule } from "angularx-flatpickr";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { SimplebarAngularModule } from "simplebar-angular";

// Pages Routing
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FlatpickrModule.forRoot(),
    NgbDropdownModule,
    SimplebarAngularModule,
    PagesRoutingModule,
    SharedModule,
  ],
  providers: [],
})
export class PagesModule {}
