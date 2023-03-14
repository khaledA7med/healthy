import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClaimsDocumentsComponent } from "./claims-documents.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ClaimsDocumentsListControlsComponent } from "./clients-documents-list-controls.component";

export const routes: Routes = [{ path: "", component: ClaimsDocumentsComponent }];

@NgModule({
	declarations: [ClaimsDocumentsComponent, ClaimsDocumentsListControlsComponent],
	imports: [CommonModule, SharedModule, AgGridModule, NgbModule, RouterModule.forChild(routes)],
})
export class ClaimsDocumentsModule {}
