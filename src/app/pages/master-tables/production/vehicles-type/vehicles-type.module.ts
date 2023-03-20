import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VehiclesTypeComponent } from "./vehicles-type.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { VehiclesTypeListControlsComponent } from "./vehicles-type-list-controls.component";

export const routes: Routes = [{ path: "", component: VehiclesTypeComponent }];

@NgModule({
  declarations: [VehiclesTypeComponent, VehiclesTypeListControlsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AgGridModule,
    NgbModule,
    RouterModule.forChild(routes),
  ],
})
export class VehiclesTypeModule {}
