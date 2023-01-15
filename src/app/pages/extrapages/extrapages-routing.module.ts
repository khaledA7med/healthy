import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StarterComponent } from "./starter/StarterComponent";

const routes: Routes = [
  {
    path: "igrid",
    loadChildren: () =>
      import("./grid-general-implement/grid-general-implement.module").then(
        (m) => m.GridGeneralImplementModule
      ),
  },
  {
    path: "starter",
    component: StarterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtraPagesRoutingModule {}
