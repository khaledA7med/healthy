import { Component, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ICellRendererParams } from "ag-grid-community";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ClaimsListComponent } from "./claims-list.component";
@Component({
  selector: "app-claims-controls",
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
          <button ngbDropdownItem class="btn btn-sm" (click)="followUp()">
            <i class="ri-chat-follow-up-fill align-bottom me-2 text-muted"></i>
            Follow Up
          </button>
          <button ngbDropdownItem (click)="Edit()" class="btn btn-sm">
            <i class="ri-edit-line align-bottom me-2 text-muted"></i>
            Edit
          </button>
          <li>
            <a class="btn btn-sm dropdown-item">
              <i class="ri-chat-forward-line align-bottom me-2 text-muted"></i>
              Notify By Email &nbsp; &nbsp; &raquo;</a
            >
            <ul class="dropdown-menu dropdown-submenu">
              <li>
                <button
                  class="btn btn-sm dropdown-item"
                  (click)="showEmail('client')"
                >
                  Client
                </button>
              </li>
              <li>
                <button
                  class="btn btn-sm dropdown-item"
                  (click)="showEmail('insurer')"
                >
                  Insurer
                </button>
              </li>
            </ul>
          </li>
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
export class ClaimsControlsComponent {
  private params!: ICellRendererParams;
  private comp!: ClaimsListComponent;

  constructor(private _Router: Router, private message: MessagesService) {}

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.comp = this.params.context.comp;
  }
  followUp() {
    this.comp.openFollowUpCanvas(this.params.data.sNo);
  }

  Edit() {
    this._Router.navigate([AppRoutes.Claims.edit, this.params.data.identity]);
  }

  showEmail(name: string) {
    let emailReqData = {
      clientID: this.params.data.clientID,
      claimNo: this.params.data.claimNo,
      policyNo: this.params.data.policyNo,
      insuranceCompany: this.params.data.insuranceCompany,
    };
    this.comp.openEmailModal(emailReqData, name);
  }
}
