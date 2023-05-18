import { Component, OnInit } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";
import { UsersManagementComponent } from "./users-management.component";
import { UsersStatus } from "src/app/shared/app/models/Users/users-utils";
import { MessagesService } from "src/app/shared/services/messages.service";
import { SweetAlertResult } from "sweetalert2";

@Component({
  selector: "app-users-management-controls",
  template: `
    <div class="col d-flex align-items-center justify-content-center">
      <div ngbDropdown class="d-inline-block">
        <button
          type="button"
          class="btn btn-sm btn-ghost-secondary waves-effect rounded-pill"
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
            (click)="Enable(usersStatus.Active)"
            class="btn btn-sm"
            *ngIf="params.data?.status === 'Disabled'"
          >
            <i
              class="ri-arrow-left-right-fill align-bottom me-2 text-muted"
            ></i>
            {{ usersStatus.Active }}
          </button>
          <button
            ngbDropdownItem
            (click)="Disable(usersStatus.Disabled)"
            class="btn btn-sm"
            *ngIf="params.data?.status === 'Active'"
          >
            <i
              class="ri-arrow-left-right-fill align-bottom me-2 text-muted"
            ></i>
            {{ usersStatus.Disabled }}
          </button>
          <button ngbDropdownItem (click)="ResetPassword()" class="btn btn-sm">
            <i class="ri-refresh-line align-bottom me-2 text-muted"></i> Reset
            Password
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
export class UsersManagementControlsComponent {
  public params!: ICellRendererParams;
  private comp!: UsersManagementComponent;
  usersStatus: any = UsersStatus;

  constructor(private message: MessagesService) {}

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  ResetPassword() {
    this.message
      .confirm("Sure!", "Reset Password?!", "primary", "question")
      .then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
          this.comp.ResetPassword(this.params.data.email);
        } else {
          return;
        }
      });
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
