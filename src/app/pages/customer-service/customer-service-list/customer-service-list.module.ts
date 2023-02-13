import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomerServiceListComponent } from "./customer-service-list.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { CustomerServiceListControlsComponent } from "./customer-service-list-controls.component";
// import { GregorianPickerModule } from "src/app/shared/components/gregorian-picker/gregorian-picker.module";
import { RangePickerModule } from "src/app/shared/components/range-picker/range-picker.module";

export const routes: Routes = [{ path: "", component: CustomerServiceListComponent }];

@NgModule({
	declarations: [CustomerServiceListComponent, CustomerServiceListControlsComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SharedModule,
		// GregorianPickerModule,
		RangePickerModule,
		AgGridModule.withComponents([CustomerServiceListControlsComponent]),
	],
})
export class CustomerServiceListModule {}
