import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ICellRendererParams } from "ag-grid-community";
import { SystemAdminStatus } from "src/app/shared/app/models/SystemAdmin/system-admin-utils";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { MessagesService } from "src/app/shared/services/messages.service";
import { SweetAlertResult } from "sweetalert2";
import { UserAccountsManagementComponent } from "./user-accounts-management.component";

@Component({
  selector: "app-user-accounts-management-controls",
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
          <button
            ngbDropdownItem
            (click)="Enable(adminStatus.Active)"
            class="btn btn-sm"
          >
            {{ adminStatus.Active }}
          </button>
          <button
            ngbDropdownItem
            (click)="Disable(adminStatus.Disable)"
            class="btn btn-sm"
          >
            {{ adminStatus.Disable }}
          </button>
          <button ngbDropdownItem (click)="ResetPassword()" class="btn btn-sm">
            Reset Password
          </button>
          <button ngbDropdownItem (click)="Edit()" class="btn btn-sm">
            Edit
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      #actionDropdown::after {
        display: none;
      }
      .dropdown-menu li {
        position: relative;
      }
      .dropdown-menu .dropdown-submenu {
        display: none;
        position: absolute;
        left: 100%;
        top: -7px;
      }
      .dropdown-menu .dropdown-submenu-left {
        right: 100%;
        left: auto;
      }
      .dropdown-menu > li:hover > .dropdown-submenu {
        display: block;
      }
    `,
  ],
})
export class UserAccountsManagementControlsComponent {
  private params!: ICellRendererParams;
  private comp!: UserAccountsManagementComponent;

  route: string = AppRoutes.Production.details;
  adminStatus: any = SystemAdminStatus;

  constructor(private _Router: Router, private message: MessagesService) {}

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  ResetPassword() {
    this.message
      .confirm("Sure!", "Reset Password?!", "primary", "question")
      .then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
          this.comp.ResetPassword(this.params.data.identity);
        } else {
          return;
        }
      });
  }

  Edit() {
    this.comp.editUser(this.params.data.identity);
  }

  Enable(status: string) {
    this.message
      .confirm("Sure!", "Change Status?!", "primary", "question")
      .then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
          this.comp.changeStatus(this.params.data, status);
        } else {
          return;
        }
      });
  }

  Disable(status: string) {
    this.message
      .confirm("Sure!", "Change Status?!", "primary", "question")
      .then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
          this.comp.changeStatus(this.params.data, status);
        } else {
          return;
        }
      });
  }
}
