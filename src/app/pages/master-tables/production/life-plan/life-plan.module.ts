import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LifePlanComponent } from "./life-plan.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LifePlanListControlsComponent } from "./life-plan-list-controls.component";

export const routes: Routes = [{ path: "", component: LifePlanComponent }];

@NgModule({
	declarations: [LifePlanComponent, LifePlanListControlsComponent],
	imports: [CommonModule, SharedModule, AgGridModule, NgbModule, RouterModule.forChild(routes)],
})
export class LifePlanModule {}
