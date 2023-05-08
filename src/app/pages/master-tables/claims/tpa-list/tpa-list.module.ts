import { TpaListComponent } from "./tpa-list/tpa-list.component";
import { TpaListFormsComponent } from "./tpa-list/tpa-list-forms.component";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AgGridModule } from "ag-grid-angular";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [{ path: "", component: TpaListComponent }];

@NgModule({
  declarations: [TpaListComponent, TpaListFormsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ],
})
export class TpaListModule {}
