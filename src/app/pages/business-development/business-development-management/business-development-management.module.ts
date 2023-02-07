import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BusinessDevelopmentManagementComponent } from "./business-development-management.component";
import { BusinessDevelopmentControlsComponent } from "./business-development-controls.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { DragulaModule } from "ng2-dragula";
import { DraggableCardComponent } from "./draggable-card.component";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRangePickerModule } from "src/app/shared/components/app-range-picker/app-range-picker.module";

export const routes: Routes = [{ path: "", component: BusinessDevelopmentManagementComponent }];

@NgModule({
	declarations: [BusinessDevelopmentManagementComponent, BusinessDevelopmentControlsComponent, DraggableCardComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SharedModule,
		NgbPaginationModule,
		DragulaModule,
		AppRangePickerModule,
		AgGridModule.withComponents([BusinessDevelopmentControlsComponent]),
	],
})
export class BusinessDevelopmentManagementModule {}
