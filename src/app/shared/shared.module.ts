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

@NgModule({
  declarations: [ScrollspyDirective, TableViewDirective],
  imports: [CommonModule, NgbNavModule, NgbAccordionModule, NgbDropdownModule],
  exports: [ScrollspyDirective, TableViewDirective],
})
export class SharedModule {}
