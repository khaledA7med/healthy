import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbNavModule,
  NgbDropdownModule,
  NgbAccordionModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";

// Select Droup down
import { NgSelectModule } from "@ng-select/ng-select";

// Flatpicker
import { FlatpickrModule } from "angularx-flatpickr";

// Load Icon
import { defineLordIconElement } from "lord-icon-element";
import lottie from "lottie-web";

// Ng Search
import { Ng2SearchPipeModule } from "ng2-search-filter";

// Component pages
import { ExtraPagesRoutingModule } from "./extrapages-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { StarterComponent } from "./starter/StarterComponent";

import { AgGridModule } from "ag-grid-angular";

@NgModule({
  declarations: [StarterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbTooltipModule,
    NgSelectModule,
    FlatpickrModule,
    ExtraPagesRoutingModule,
    SharedModule,
    Ng2SearchPipeModule,
    AgGridModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExtraspagesModule {
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
}
