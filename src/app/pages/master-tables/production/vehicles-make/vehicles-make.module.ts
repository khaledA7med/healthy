import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VehiclesMakeComponent } from "./vehicles-make.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { VehiclesMakeListControlsComponent } from "./vehicles-make-list-controls.component";

export const routes: Routes = [{ path: "", component: VehiclesMakeComponent }];

@NgModule({
  declarations: [VehiclesMakeComponent, VehiclesMakeListControlsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AgGridModule,
    NgbModule,
    RouterModule.forChild(routes),
  ],
})
export class VehiclesMakeModule {}
