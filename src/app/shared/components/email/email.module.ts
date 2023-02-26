import { NgSelectModule } from "@ng-select/ng-select";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmailModalComponent } from "./email-modal/email-modal.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

@NgModule({
  declarations: [EmailModalComponent],
  imports: [CommonModule, NgSelectModule, CKEditorModule],
  exports: [EmailModalComponent],
})
export class EmailModule {}
