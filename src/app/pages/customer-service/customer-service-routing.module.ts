import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

const routes: Routes = [
  {
    path: AppRoutes.CustomerService.base,
    data: { title: "Request Management" },
    loadChildren: () =>
      import("./customer-service-list/customer-service-list.module").then(
        (m) => m.CustomerServiceListModule
      ),
  },
  {
    path: AppRoutes.CustomerService.create,
    data: { title: "Customer Service Registry" },
    loadChildren: () =>
      import("./customer-service-forms/customer-service-forms.module").then(
        (m) => m.CustomerServiceFormsModule
      ),
  },
  {
    path: AppRoutes.CustomerService.edit + ":id",
    data: { title: "Customer Service Update" },
    loadChildren: () =>
      import("./customer-service-forms/customer-service-forms.module").then(
        (m) => m.CustomerServiceFormsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerServiceRoutingModule {}
