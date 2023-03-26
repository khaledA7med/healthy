import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NgbNavModule,
  NgbAccordionModule,
  NgbDropdownModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";

// Counter

import { ScrollspyDirective } from "./scrollspy.directive";
import { TableViewDirective } from "./directives/table-view.directive";
import { FlatpickrModule } from "angularx-flatpickr";
import { SimplebarAngularModule } from "simplebar-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { InputMaskDirective } from "./directives/input-mask.directive";
import { SubLoaderModule } from "./components/sub-loader/sub-loader.module";

@NgModule({
  declarations: [ScrollspyDirective, TableViewDirective, InputMaskDirective],
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
    SubLoaderModule,
    NgbTooltipModule,
  ],
  exports: [
    ScrollspyDirective,
    TableViewDirective,
    NgbDropdownModule,
    SimplebarAngularModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAccordionModule,
    InputMaskDirective,
    SubLoaderModule,
    NgbTooltipModule,
  ],
})
export class SharedModule {}
