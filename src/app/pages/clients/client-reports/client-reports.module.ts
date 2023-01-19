import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientReportsComponent } from "./client-reports.component";

import { RouterModule, Routes } from "@angular/router";

export const routes: Routes = [{ path: "", component: ClientReportsComponent }];

@NgModule({
  declarations: [ClientReportsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ClientReportsModule {}
