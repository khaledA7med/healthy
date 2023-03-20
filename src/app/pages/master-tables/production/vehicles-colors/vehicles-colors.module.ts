import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VehiclesColorsComponent } from "./vehicles-colors.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { VehiclesColorListControlsComponent } from "./vehicles-color-list-controls.component";

export const routes: Routes = [
  { path: "", component: VehiclesColorsComponent },
];

@NgModule({
  declarations: [VehiclesColorsComponent, VehiclesColorListControlsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AgGridModule,
    NgbModule,
    RouterModule.forChild(routes),
  ],
})
export class VehiclesColorsModule {}
