import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HospitalsComponent } from "./hospitals.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { HospitalsListControlsComponent } from "./hospitals-list-controls.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HospitalFormsModule } from "../hospital-forms/hospital-forms.module";

export const routes: Routes = [{ path: "", component: HospitalsComponent }];

@NgModule({
  declarations: [HospitalsComponent, HospitalsListControlsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
    NgbModule,
    HospitalFormsModule,
  ],
})
export class HospitalsModule {}
