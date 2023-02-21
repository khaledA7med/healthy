import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/shared/app/routers/appRouters';

const routes: Routes = [
  {
    path: AppRoutes.SystemAdmin.base,
    data: { title: "Request Management" },
    loadChildren: () =>
      import("./user-accounts-management/user-accounts-management.module").then(
        (m) => m.UserAccountsManagementModule
      ),
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SystemAdminRoutingModule { }
