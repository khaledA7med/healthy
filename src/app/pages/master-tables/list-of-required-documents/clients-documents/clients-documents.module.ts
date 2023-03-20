import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientsDocumentsComponent } from "./clients-documents.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ClientsDocumentsListControlsComponent } from "./clients-documents-list-controls.component";

export const routes: Routes = [
  { path: "", component: ClientsDocumentsComponent },
];

@NgModule({
  declarations: [
    ClientsDocumentsComponent,
    ClientsDocumentsListControlsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AgGridModule,
    NgbModule,
    RouterModule.forChild(routes),
  ],
})
export class ClientsDocumentsModule {}
