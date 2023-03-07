import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductionRenewalReportComponent } from "./production-renewal-report.component";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { GregorianPickerModule } from "src/app/shared/components/gregorian-picker/gregorian-picker.module";
import { ReportsViewerModule } from "src/app/shared/components/reports-viewer/reports-viewer.module";

export const routes: Routes = [{ path: "", component: ProductionRenewalReportComponent }];

@NgModule({
	declarations: [ProductionRenewalReportComponent],
	imports: [CommonModule, SharedModule, RouterModule.forChild(routes), NgbModule, GregorianPickerModule, ReportsViewerModule],
})
export class ProductionRenewalReportModule {}
