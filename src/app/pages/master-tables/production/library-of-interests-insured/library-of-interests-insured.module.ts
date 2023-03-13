import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LibraryOfInterestsInsuredComponent } from "./library-of-interests-insured.component";
import { LibrariesFormModule } from "../libraries-form/libraries-form.module";

export const routes: Routes = [{ path: "", component: LibraryOfInterestsInsuredComponent }];

@NgModule({
	declarations: [LibraryOfInterestsInsuredComponent],
	imports: [CommonModule, SharedModule, RouterModule.forChild(routes), NgbModule, LibrariesFormModule, LibrariesFormModule],
})
export class LibraryOfInterestsInsuredModule {}
