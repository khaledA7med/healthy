import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MedicalActiveListComponent } from "./medical-active-list/medical-active-list.component";
import { MedicalActiveListControlsComponent } from "./medical-active-list/medical-active-list-controls.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: MedicalActiveListComponent },
];

@NgModule({
  declarations: [
    MedicalActiveListComponent,
    MedicalActiveListControlsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgGridModule,
  ],
})
export class MedicalActiveListModule {}
