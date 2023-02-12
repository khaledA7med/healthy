import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

// Counter

import { ScrollspyDirective } from "./scrollspy.directive";
import { TableViewDirective } from "./directives/table-view.directive";
import { FlatpickrModule } from "angularx-flatpickr";
import { SimplebarAngularModule } from "simplebar-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { InputMaskDirective } from "./directives/input-mask.directive";

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
	],
})
export class SharedModule {}
