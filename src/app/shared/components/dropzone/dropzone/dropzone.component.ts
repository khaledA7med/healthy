import { Subscription } from "rxjs";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import AppUtils from "src/app/shared/app/util";
import { MessagesService } from "src/app/shared/services/messages.service";
import { HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";

@Component({
  selector: "app-dropzone",
  templateUrl: "./dropzone.component.html",
  styleUrls: ["./dropzone.component.scss"],
})
export class DropzoneComponent implements OnDestroy {
  documentsToUpload: any[] = [];
  documentsToDisplay: any[] = [];
  subscribes: Subscription[] = [];

  @Input() UploadedFiles: any[] = [];

  @Output() files: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private message: MessagesService,
    public util: AppUtils,
    private masterMethod: MasterMethodsService
  ) {}

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

  downloadFile(path: string) {
    let sub = this.masterMethod.downloadFile(path).subscribe({
      next: (res) => {
        const downloadedFile = new Blob([res.body as BlobPart], {
          type: res.body,
        });
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.download = path;
        a.href = URL.createObjectURL(downloadedFile);
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
      },
      error: (error) => {
        this.message.popup("Oops!", error.message, "error");
      },
    });
    this.subscribes.push(sub);
  }

  removeImage(item: any, isServer?: boolean) {
    this.message
      .confirm("Sure!", "delete this file?!", "danger", "question")
      .then((res: any) => {
        if (res.isConfirmed) {
          this.documentsToDisplay = this.documentsToDisplay.filter(
            (doc) => doc.name !== item.name
          );
          this.documentsToUpload = this.documentsToUpload.filter(
            (doc) => doc.name !== item.name
          );
          if (isServer) {
            let sub = this.masterMethod
              .deleteFile(item.data)
              .subscribe((res: HttpResponse<IBaseResponse<boolean>>) => {
                if (res.body?.status) {
                  this.message.toast("Deleted!", "info");
                  this.emitingFiles();
                  this.UploadedFiles = this.UploadedFiles.filter(
                    (el) => el.name !== item.name
                  );
                } else
                  this.message.popup("Oops!", res.body?.message!, "warning");
              });
            this.subscribes.push(sub);
          }
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

  fileIcon(type: string): { cls: string; ico: string } {
    let cls = "",
      ico = "";

    switch (type) {
      case "msword" &&
        "doc" &&
        "docx" &&
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        cls = "bg-soft-secondary text-secondary";
        ico = "ri-file-word-2-fill";
        break;
      case "vnd.ms-powerpoint" &&
        "ppt" &&
        "pptx" &&
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        cls = "bg-soft-danger text-danger";
        ico = "ri-file-ppt-fill";
        break;
      case "text" && "txt":
        cls = "bg-soft-dark text-muted";
        ico = "ri-file-text-fill";
        break;
      case "pdf":
        cls = "bg-soft-danger text-danger";
        ico = "ri-file-pdf-fill";
        break;
      case "zip":
        cls = "bg-soft-info text-info";
        ico = "ri-file-zip-fill";
        break;
      case "vnd.ms-excel" &&
        "xls" &&
        "xlsx" &&
        "csv" &&
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        cls = "bg-soft-success text-success";
        ico = "ri-file-excel-2-fill";
        break;
      default:
        cls = "bg-soft-success text-success";
        ico = "ri-error-warning-fill";
        break;
    }
    return { cls: cls, ico: ico };
  }

  emitingFiles() {
    this.files.emit(this.documentsToUpload);
  }
  ngOnDestroy() {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
