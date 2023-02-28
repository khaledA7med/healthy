import { SimplebarAngularModule } from "simplebar-angular";
import { EmailListComponent } from "./email-list.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { EmailModule } from "src/app/shared/components/email/email.module";
export const routes: Routes = [{ path: "", component: EmailListComponent }];

@NgModule({
  declarations: [EmailListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    EmailModule,
  ],
})
export class EmailListModule {}
