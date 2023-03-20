import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientCategoriesComponent } from "./client-categories/client-categories.component";
import { ClientCategoriesFormsComponent } from "./client-categories/client-categories-forms.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [
  { path: "", component: ClientCategoriesComponent },
];

@NgModule({
  declarations: [ClientCategoriesComponent, ClientCategoriesFormsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ],
})
export class ClientCategoriesModule {}
