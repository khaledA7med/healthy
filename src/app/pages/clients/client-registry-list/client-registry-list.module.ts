import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientRegistryListComponent } from "./client-registry-list/client-registry-list.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ClientListControlsComponent } from "./client-registry-list/client-list-controls.component";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: ClientRegistryListComponent },
];

@NgModule({
  declarations: [ClientRegistryListComponent, ClientListControlsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgGridModule.withComponents([ClientListControlsComponent]),
  ],
})
export class ClientRegistryListModule {}
