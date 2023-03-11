import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClaimsFormsComponent } from "./claims-forms.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbAccordionModule, NgbCollapseModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { DropzoneModule } from "src/app/shared/components/dropzone/dropzone.module";
import { GregorianPickerModule } from "src/app/shared/components/gregorian-picker/gregorian-picker.module";
import { ClaimsRequestListComponent } from "./claims-request-list.component";
import { AgGridModule } from "ag-grid-angular";
import { ClaimPaymentsFormComponent } from "./form-helpers/claim-payments-form.component";
import { ClaimApprovalsFormComponent } from "./form-helpers/claim-approvals-form.component";
import { ClaimInvoicesFormComponent } from "./form-helpers/claim-invoices-form.component";
import { ClaimRejectDeductFormComponent } from "./form-helpers/claim-reject-deduct-form.component";
import { ReportsViewerModule } from "src/app/shared/components/reports-viewer/reports-viewer.module";

export const routes: Routes = [{ path: "", component: ClaimsFormsComponent }];

@NgModule({
	declarations: [
		ClaimsFormsComponent,
		ClaimsRequestListComponent,
		ClaimPaymentsFormComponent,
		ClaimApprovalsFormComponent,
		ClaimInvoicesFormComponent,
		ClaimRejectDeductFormComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(routes),
		NgSelectModule,
		NgbAccordionModule,
		NgbCollapseModule,
		DropzoneModule,
		GregorianPickerModule,
		AgGridModule,
		NgbTooltipModule,
		ReportsViewerModule,
	],
})
export class ClaimsFormsModule {}
