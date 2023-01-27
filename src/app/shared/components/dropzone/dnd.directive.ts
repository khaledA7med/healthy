import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from "@angular/core";

@Directive({
  selector: "[appDnd]",
})
export class DndDirective {
  @HostBinding("class.draggable-items") fileOver: boolean = false;
  @Output() fileDropped = new EventEmitter<any>();

  @HostListener("dragover", ["$event"]) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  @HostListener("drop", ["$event"]) public onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;

    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
