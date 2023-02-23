import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { UserPrivilegesComponent } from "./user-privileges.component";

import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [{ path: "", component: UserPrivilegesComponent }];

@NgModule({
	declarations: [UserPrivilegesComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule, AgGridModule],
})
export class UserPrivilegesModule {}
