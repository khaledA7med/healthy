import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReportsViewerComponent } from "./reports-viewer.component";
import { SafePipe } from "./safe.pipe";

@NgModule({
	declarations: [ReportsViewerComponent, SafePipe],
	imports: [CommonModule],
})
export class ReportsViewerModule {}
