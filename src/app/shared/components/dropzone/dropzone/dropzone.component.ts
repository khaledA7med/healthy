import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import AppUtils from "src/app/shared/app/util";
import { MessagesService } from "src/app/shared/services/messages.service";

@Component({
  selector: "app-dropzone",
  templateUrl: "./dropzone.component.html",
  styleUrls: ["./dropzone.component.scss"],
  providers: [AppUtils],
})
export class DropzoneComponent implements OnChanges {
  documentsToUpload: any[] = [];
  documentsToDisplay: any[] = [];

  @Input() UploadedFiles: any;

  @Output() files: EventEmitter<any> = new EventEmitter<any>();

  constructor(private message: MessagesService, public util: AppUtils) {}

  ngOnChanges(): void {
    if (this.UploadedFiles) this.documentsToDisplay = this.UploadedFiles;
  }

  onSelectFiles(e: Event) {
    const elem = e.target as HTMLInputElement;
    let files = elem.files!;
    let cls = this;
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      this.documentsToUpload.push(files[i]);
      reader.onload = ((file) => {
        return function (e: any) {
          cls.documentsToDisplay.push({
            id: Date.now(),
            name: files[i].name,
            size: files[i].size,
            type: file.type,
            data: e.target.result,
          });
        };
      })(files[i]);
      reader.readAsDataURL(files[i]);
    }
    this.emitingFiles();
  }

  openImage(img: string) {
    var win = window.open("about:blank");
    win?.document.write(
      '<iframe style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;" src="' +
        img +
        '"></iframe>'
    );
  }

  removeImage(item: any) {
    this.message
      .confirm("Sure!", "You Want To Delete ?!", "danger", "question")
      .then((res: any) => {
        if (res.isConfirmed) {
          this.documentsToDisplay = this.documentsToDisplay.filter(
            (doc) => doc.name !== item
          );
          this.documentsToUpload = this.documentsToUpload.filter(
            (doc) => doc.name !== item
          );
          this.message.toast("Delete!", "info");
          this.emitingFiles();
        }
      });
  }

  onFileDropped(e: any) {
    for (let i = 0; i < e.length; i++) {
      let reader = new FileReader();
      this.documentsToUpload.push(e[i]);
      reader.onload = ((file) => {
        let cls = this;
        return function (e: any) {
          cls.documentsToDisplay.push({
            id: Date.now(),
            name: file.name,
            size: file.size,
            type: file.type,
            data: e.target.result,
          });
        };
      })(e[i]);
      reader.readAsDataURL(e[i]);
    }
    this.emitingFiles();
  }

  clearImages() {
    this.UploadedFiles = [];
    this.documentsToDisplay = [];
    this.documentsToUpload = [];
    this.emitingFiles();
  }

  emitingFiles() {
    this.files.emit(this.documentsToUpload);
  }
}
