import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomerServiceFormsComponent } from "./customer-service-forms.component";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { DropzoneModule } from "src/app/shared/components/dropzone/dropzone.module";
import { GregorianPickerModule } from "src/app/shared/components/gregorian-picker/gregorian-picker.module";
import { CustomerServiceListComponent } from "./customer-service-list.component";

export const routes: Routes = [{ path: "", component: CustomerServiceFormsComponent }];

@NgModule({
	declarations: [CustomerServiceFormsComponent, CustomerServiceListComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule, NgbCollapseModule, DropzoneModule, GregorianPickerModule, AgGridModule],
})
export class CustomerServiceFormsModule {}
