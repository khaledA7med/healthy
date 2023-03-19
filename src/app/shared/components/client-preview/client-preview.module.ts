import { ClientPreviewComponent } from "./client-preview.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.module";

@NgModule({
	declarations: [ClientPreviewComponent],
	imports: [CommonModule, SharedModule],
})
export class ClientPreviewModule {}
