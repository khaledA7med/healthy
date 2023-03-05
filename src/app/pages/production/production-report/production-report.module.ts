import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductionReportComponent } from "./production-report.component";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { GregorianPickerModule } from "src/app/shared/components/gregorian-picker/gregorian-picker.module";
import { ReportsViewerModule } from "../../reports-viewer/reports-viewer.module";

export const routes: Routes = [{ path: "", component: ProductionReportComponent }];

@NgModule({
	declarations: [ProductionReportComponent],
	imports: [CommonModule, SharedModule, RouterModule.forChild(routes), NgbModule, GregorianPickerModule, ReportsViewerModule],
})
export class ProductionReportModule {}
