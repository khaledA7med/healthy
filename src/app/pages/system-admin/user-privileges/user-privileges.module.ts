import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { UserPrivilegesComponent } from "./user-privileges.component";
import { AgGridModule } from "ag-grid-angular";
import { UserRolesManagementControlsComponent } from "./user-roles-management-controls.component";
import { NgbAccordionModule, NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";

export const routes: Routes = [{ path: "", component: UserPrivilegesComponent }];

@NgModule({
	declarations: [UserPrivilegesComponent, UserRolesManagementControlsComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SharedModule,
		AgGridModule.withComponents([UserRolesManagementControlsComponent]),
		NgbAccordionModule,
		NgbCollapseModule,
	],
})
export class UserPrivilegesModule {}
