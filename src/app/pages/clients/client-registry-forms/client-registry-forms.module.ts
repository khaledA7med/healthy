import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientRegistryFormsComponent } from "./client-registry-forms.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [
  { path: "", component: ClientRegistryFormsComponent },
];

@NgModule({
  declarations: [ClientRegistryFormsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class ClientRegistryFormsModule {}
