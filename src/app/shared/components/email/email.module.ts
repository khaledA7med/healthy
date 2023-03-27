import { NgSelectModule } from "@ng-select/ng-select";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmailModalComponent } from "./email-modal/email-modal.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { DropzoneModule } from "../dropzone/dropzone.module";
import { SimplebarAngularModule } from "simplebar-angular";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
	declarations: [EmailModalComponent],
	imports: [CommonModule, NgSelectModule, CKEditorModule, DropzoneModule, SimplebarAngularModule, ReactiveFormsModule, NgbCollapseModule],
	exports: [EmailModalComponent],
})
export class EmailModule {}
