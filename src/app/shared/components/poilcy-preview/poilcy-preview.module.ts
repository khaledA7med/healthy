import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PoilcyPreviewComponent } from "./poilcy-preview.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared.module";

export const routes: Routes = [{ path: "", component: PoilcyPreviewComponent }];

@NgModule({
	declarations: [PoilcyPreviewComponent],
	imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class PoilcyPreviewModule {}
