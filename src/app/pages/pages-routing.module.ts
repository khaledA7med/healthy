import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Component pages

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./clients/clients.module").then((m) => m.ClientsModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./extrapages/extraspages.module").then(
        (m) => m.ExtraspagesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
