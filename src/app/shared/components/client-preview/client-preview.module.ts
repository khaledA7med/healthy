import { ClientPreviewComponent } from "./client-preview.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared.module";

export const routes: Routes = [{ path: "", component: ClientPreviewComponent }];

@NgModule({
  declarations: [ClientPreviewComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class ClientPreviewModule {}
