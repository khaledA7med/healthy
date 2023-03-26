import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmailModalComponent } from "./email-modal/email-modal.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { DropzoneModule } from "../dropzone/dropzone.module";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../../shared.module";
import { AgGridModule } from "ag-grid-angular";
import { ClientContactsComponent } from "./client-contacts/client-contacts.component";

@NgModule({
	declarations: [EmailModalComponent, ClientContactsComponent],
	imports: [CommonModule, SharedModule, CKEditorModule, DropzoneModule, NgbCollapseModule, AgGridModule],
	exports: [EmailModalComponent],
})
export class EmailModule {}
