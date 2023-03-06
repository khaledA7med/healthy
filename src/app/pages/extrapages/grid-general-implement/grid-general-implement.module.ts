import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GridViewComponent } from "./grid-view/grid-view.component";

import { RouterModule, Routes } from "@angular/router";
import { AgGridModule } from "ag-grid-angular";
import { GeneralGridMenuComponent } from "./general-grid-menu/general-grid-menu.component";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [{ path: "", component: GridViewComponent }];

@NgModule({
  declarations: [GridViewComponent, GeneralGridMenuComponent],
  imports: [
    CommonModule,
    AgGridModule,
    RouterModule.forChild(routes),
    NgbDropdownModule,
    SharedModule,
  ],
})
export class GridGeneralImplementModule {}
