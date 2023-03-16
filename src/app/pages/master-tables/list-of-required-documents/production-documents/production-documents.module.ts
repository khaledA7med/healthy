import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductionDocumentsComponent } from "./production-documents.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ProductionDocumentsListControlsComponent } from "./production-documents-list-controls.component";

export const routes: Routes = [{ path: "", component: ProductionDocumentsComponent }];

@NgModule({
	declarations: [ProductionDocumentsComponent, ProductionDocumentsListControlsComponent],
	imports: [CommonModule, SharedModule, AgGridModule, NgbModule, RouterModule.forChild(routes)],
})
export class ProductionDocumentsModule {}
