import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LibraryOfWarrantiesComponent } from "./library-of-warranties.component";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LibrariesFormModule } from "../libraries-form/libraries-form.module";

export const routes: Routes = [
  { path: "", component: LibraryOfWarrantiesComponent },
];

@NgModule({
  declarations: [LibraryOfWarrantiesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgbModule,
    LibrariesFormModule,
  ],
})
export class LibraryOfWarrantiesModule {}