import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { ICellRendererParams } from "ag-grid-community";
import { Observable } from "rxjs";
import { ClientsPermissions } from "src/app/core/roles/clients-permissions";
import { Roles } from "src/app/core/roles/Roles";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
@Component({
  selector: "app-client-list-controls",
  template: `
    <div class="col">
      <div ngbDropdown class="d-inline-block">
        <button
          type="button"
          class="btn btn-ghost-secondary waves-effect rounded-pill"
          id="actionDropdown"
          ngbDropdownToggle
        >
          <i class="ri-more-2-fill"></i>
        </button>
        <div ngbDropdownMenu aria-labelledby="actionDropdown">
          <button
            ngbDropdownItem
            (click)="Edit()"
            class="btn btn-sm"
            *ngIf="
              !(permissions$ | async)?.includes(
                privileges.ChClientsRegistryAdministratorReadOnly
              )
            "
          >
            Edit
          </button>
          <button ngbDropdownItem (click)="view()" class="btn btn-sm">
            View
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ["#actionDropdown::after {display: none}"],
})
export class ClientListControlsComponent {
  private params!: ICellRendererParams;
  route: string = AppRoutes.Client.clientRegistry;
  permissions$!: Observable<string[]>;
  privileges = ClientsPermissions;
  constructor(
    private _Router: Router,
    private permission: PermissionsService
  ) {}

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.permissions$ = this.permission.getPrivileges(Roles.Clients);
  }

  Edit() {
    this._Router.navigate([
      AppRoutes.Client.clientEdit,
      this.params.data.identity,
    ]);
  }

  view() {
    this._Router.navigate([
      { outlets: { details: [this.route, this.params.data.identity] } },
    ]);
  }
}
