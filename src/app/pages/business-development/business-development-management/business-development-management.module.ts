import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BusinessDevelopmentManagementComponent } from "./business-development-management.component";
import { BusinessDevelopmentControlsComponent } from "./business-development-controls.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { DragulaModule } from "ng2-dragula";

export const routes: Routes = [{ path: "", component: BusinessDevelopmentManagementComponent }];

@NgModule({
	declarations: [BusinessDevelopmentManagementComponent, BusinessDevelopmentControlsComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SharedModule,
		DragulaModule,
		AgGridModule.withComponents([BusinessDevelopmentControlsComponent]),
	],
})
export class BusinessDevelopmentManagementModule {}
