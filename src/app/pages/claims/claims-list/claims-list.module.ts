import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClaimsListComponent } from "./claims-list.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [{ path: "", component: ClaimsListComponent }];

@NgModule({
  declarations: [ClaimsListComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class ClaimsListModule {}
