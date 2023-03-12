import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LibrariesFormComponent } from "./libraries-form.component";
import { SharedModule } from "src/app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
	declarations: [LibrariesFormComponent],
	imports: [CommonModule, SharedModule, AgGridModule, NgbModule],
	exports: [LibrariesFormComponent],
})
export class LibrariesFormModule {}
