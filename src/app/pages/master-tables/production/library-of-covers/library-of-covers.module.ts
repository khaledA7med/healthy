import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LibraryOfCoversComponent } from "./library-of-covers.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LibrariesFormModule } from "../libraries-form/libraries-form.module";

export const routes: Routes = [
  { path: "", component: LibraryOfCoversComponent },
];

@NgModule({
  declarations: [LibraryOfCoversComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgbModule,
    LibrariesFormModule,
  ],
})
export class LibraryOfCoversModule {}
