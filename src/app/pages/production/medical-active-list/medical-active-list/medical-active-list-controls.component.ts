import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ICellRendererParams } from "ag-grid-community";
import { MedicalActiveListComponent } from "./medical-active-list.component";
import { PoliciesManagementComponent } from "../../policies-management/policies-management.component";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { Observable } from "rxjs";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { SalesLeadStatus } from "src/app/shared/app/models/BusinessDevelopment/business-development-util";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { Roles } from "src/app/core/roles/Roles";

@Component({
  selector: "app-medical-active-list-controls",
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
        <div
          ngbDropdownMenu
          aria-labelledby="actionDropdown"
          class="dropdown-menu"
        >
          <button ngbDropdownItem (click)="View()" class="btn btn-sm">
            View
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ["#actionDropdown::after {display: none}"],
})
export class MedicalActiveListControlsComponent {
  private params!: ICellRendererParams;
  public comp!: MedicalActiveListComponent;
  permissions$!: Observable<string[]>;
  privileges = ProductionPermissions;
  route: string = AppRoutes.Production.details;
  leadStatus: any = SalesLeadStatus;
  constructor(
    private _Router: Router,
    private permission: PermissionsService
  ) {}

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.comp = this.params.context.comp;
    this.permissions$ = this.permission.getPrivileges(Roles.Production);
  }

  View() {
    this.comp.openMedicalActivePreview(this.params.data.identity);
  }
}
