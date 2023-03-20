import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LocationsComponent } from "./locations/locations.component";
import { LocationsFormsComponent } from "./locations/locations-forms.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [{ path: "", component: LocationsComponent }];

@NgModule({
  declarations: [LocationsComponent, LocationsFormsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ],
})
export class LocationsModule {}
