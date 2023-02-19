import { AgGridModule } from "ag-grid-angular";
import { ClaimsControlsComponent } from "./claims-controls.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClaimsListComponent } from "./claims-list.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [{ path: "", component: ClaimsListComponent }];

@NgModule({
  declarations: [ClaimsListComponent, ClaimsControlsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule.withComponents(ClaimsControlsComponent),
  ],
})
export class ClaimsListModule {}
