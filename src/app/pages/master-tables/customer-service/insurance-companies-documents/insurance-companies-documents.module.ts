import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InsuranceCompaniesDocumentsComponent } from "./insurance-companies-documents/insurance-companies-documents.component";
import { InsuranceCompaniesDocumentsFormsComponent } from "./insurance-companies-documents/insurance-companies-documents-forms.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { DropzoneModule } from "src/app/shared/components/dropzone/dropzone.module";

export const routes: Routes = [
  { path: "", component: InsuranceCompaniesDocumentsComponent },
];

@NgModule({
  declarations: [
    InsuranceCompaniesDocumentsComponent,
    InsuranceCompaniesDocumentsFormsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
    DropzoneModule,
  ],
})
export class InsuranceCompaniesDocumentsModule {}
