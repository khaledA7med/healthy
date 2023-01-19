import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule, Routes } from "@angular/router";
import { ClientGroupComponent } from "./client-group.component";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { ClientGroupListControlsComponent } from "./client-group-list-controls.component";

export const routes: Routes = [{ path: "", component: ClientGroupComponent }];

@NgModule({
	declarations: [ClientGroupComponent, ClientGroupListControlsComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule, AgGridModule.withComponents([ClientGroupListControlsComponent])],
})
export class ClientGroupModule {}
