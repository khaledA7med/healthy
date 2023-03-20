import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LegalStatusComponent } from "./legal-status/legal-status.component";
import { LegalStatusFormsComponent } from "./legal-status/legal-status-forms.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";

export const routes: Routes = [{ path: "", component: LegalStatusComponent }];

@NgModule({
  declarations: [LegalStatusComponent, LegalStatusFormsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ],
})
export class LegalStatusModule {}
