import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { ICellRendererParams } from "ag-grid-community";
import { Observable } from "rxjs";
import { ClientsPermissions } from "src/app/core/roles/clients-permissions";
import { Roles } from "src/app/core/roles/Roles";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { ClientRegistryListComponent } from "./client-registry-list.component";

@Component({
  selector: "app-client-list-controls",
  template: `
    <div class="col d-flex align-items-center justify-content-center">
      <div ngbDropdown class="d-inline-block">
        <button
          type="button"
          class="btn btn-sm btn-ghost-secondary btn-sm waves-effect rounded-pill"
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
            <i class="ri-edit-line align-bottom me-2 text-muted"></i> Edit
          </button>
          <button ngbDropdownItem (click)="view()" class="btn btn-sm">
            <i class="ri-eye-line align-bottom me-2 text-muted"></i> View
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ["#actionDropdown::after {display: none}"],
})
export class ClientListControlsComponent {
  private params!: ICellRendererParams;
  public comp!: ClientRegistryListComponent;
  permissions$!: Observable<string[]>;
  privileges = ClientsPermissions;

  constructor(
    private _Router: Router,
    private permission: PermissionsService
  ) {}

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.comp = this.params.context.comp;
    this.permissions$ = this.permission.getPrivileges(Roles.Clients);
  }

  Edit() {
    this._Router.navigate([
      AppRoutes.Client.clientEdit,
      this.params.data.identity,
    ]);
  }

  view() {
    this.comp.openClientPreview(this.params.data.identity);
    // this._Router.navigate([{ outlets: { details: [this.route, this.params.data.identity] } }]);
  }
}
