import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientRegistryFormsComponent } from "./client-registry-forms.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import {
  NgbAccordionModule,
  NgbCollapseModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { DropzoneModule } from "src/app/shared/components/dropzone/dropzone.module";

export const routes: Routes = [
  { path: "", component: ClientRegistryFormsComponent },
];

@NgModule({
  declarations: [ClientRegistryFormsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgSelectModule,
    NgbAccordionModule,
    NgbCollapseModule,
    DropzoneModule,
  ],
})
export class ClientRegistryFormsModule {}
