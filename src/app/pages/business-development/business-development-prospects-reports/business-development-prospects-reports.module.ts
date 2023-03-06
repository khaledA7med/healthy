import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { GregorianPickerModule } from "src/app/shared/components/gregorian-picker/gregorian-picker.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReportsViewerModule } from "../../reports-viewer/reports-viewer.module";
import { BusinessDevelopmentProspectsReportsComponent } from "./business-development-prospects-reports.component";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [{ path: "", component: BusinessDevelopmentProspectsReportsComponent }];

@NgModule({
	declarations: [BusinessDevelopmentProspectsReportsComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule, NgbModule, GregorianPickerModule, ReportsViewerModule],
})
export class BusinessDevelopmentProspectsReportsModule {}
