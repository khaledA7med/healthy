import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { RouterModule, Routes } from "@angular/router";
import { ClientGroupComponent } from "./client-group.component";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { ClientGroupListControlsComponent } from "./client-group-list-controls.component";
import { GroupsClientsComponent } from "./groups-clients/groups-clients.component";
import { GroupClientsListControlsComponent } from "./groups-clients/group-clients-list-controls.component";
export const routes: Routes = [{ path: "", component: ClientGroupComponent }];

@NgModule({
  declarations: [
    ClientGroupComponent,
    GroupsClientsComponent,
    ClientGroupListControlsComponent,
    GroupClientsListControlsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AgGridModule,
  ],
})
export class ClientGroupModule {}
