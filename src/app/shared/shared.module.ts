import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NgbNavModule,
  NgbAccordionModule,
  NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";

// Counter

import { ScrollspyDirective } from "./scrollspy.directive";
import { TableViewDirective } from "./table-view.directive";
import { FlatpickrModule } from "angularx-flatpickr";
import { SimplebarAngularModule } from "simplebar-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ClientPreviewComponent } from "./components/client-preview/client-preview.component";

@NgModule({
  declarations: [
    ScrollspyDirective,
    TableViewDirective,
    ClientPreviewComponent,
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    FlatpickrModule.forRoot(),
    NgbDropdownModule,
    SimplebarAngularModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  exports: [
    ScrollspyDirective,
    TableViewDirective,
    NgbDropdownModule,
    SimplebarAngularModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    ClientPreviewComponent,
  ],
})
export class SharedModule {}
