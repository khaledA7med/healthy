import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// Pages Routing
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, PagesRoutingModule, SharedModule],
  providers: [],
})
export class PagesModule {}
