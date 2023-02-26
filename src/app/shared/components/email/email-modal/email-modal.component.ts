import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";

@Component({
  selector: "app-email-modal",
  templateUrl: "./email-modal.component.html",
  styleUrls: ["./email-modal.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EmailModalComponent implements OnInit {
  @ViewChild("emailContent") emailContent!: ElementRef;
  subject = [{ name: "hight" }, { name: "medium" }, { name: "low" }];
  editorData = ClassicEditor;
  // defaultConfig = {
  //   toolbar: {
  //     items: [
  //       "heading",
  //       "|",
  //       "bold",
  //       "italic",
  //       "underline",
  //       "link",
  //       "strikethrough",
  //       "alignment",
  //       "bulletedList",
  //       "todoList",
  //       "numberedList",
  //       "fontBackgroundColor",
  //       "fontColor",
  //       "fontFamily",
  //       "fontSize",
  //       "highlight",
  //       "|",
  //       "imageUpload",
  //       "blockQuote",
  //       "insertTable",
  //       "undo",
  //       "redo",
  //       "findAndReplace",
  //       "|",
  //       "imageInsert",
  //       "removeFormat",
  //       "specialCharacters",
  //       "style",
  //     ],
  //   },
  //   language: "en",
  //   image: {
  //     toolbar: ["imageTextAlternative", "linkImage"],
  //   },
  //   table: {
  //     contentToolbar: [
  //       "tableColumn",
  //       "tableRow",
  //       "mergeTableCells",
  //       "tableCellProperties",
  //       "tableProperties",
  //     ],
  //   },
  // };
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}
  openModal() {
    this.modalService.open(this.emailContent, {
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }
  getEditorData({ editor }: ChangeEvent) {
    console.log(editor.getData());
  }
}
