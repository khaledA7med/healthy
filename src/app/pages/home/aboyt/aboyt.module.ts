import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AboytComponent } from "./aboyt.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

export const routes: Routes = [{ path: "", component: AboytComponent }];

@NgModule({
  declarations: [AboytComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class AboytModule {}
