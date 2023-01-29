import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropzoneComponent } from "./dropzone/dropzone.component";
import { DndDirective } from "./dnd.directive";

@NgModule({
  declarations: [DropzoneComponent, DndDirective],
  imports: [CommonModule],
  exports: [DropzoneComponent, DndDirective],
})
export class DropzoneModule {}
