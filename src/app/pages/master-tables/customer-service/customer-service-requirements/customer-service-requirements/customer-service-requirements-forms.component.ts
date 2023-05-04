import { Component } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";
import { MessagesService } from "src/app/shared/services/messages.service";
import { SweetAlertResult } from "sweetalert2";
import { CustomerServiceRequirementsComponent } from "./customer-service-requirements.component";

@Component({
  selector: "app-customer-service-requirements-forms",
  template: `
    <div class="col d-flex align-items-center justify-content-center">
      <div ngbDropdown class="d-inline-block">
        <button
          type="button"
          class="btn btn-ghost-secondary btn-sm waves-effect rounded-pill"
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
            type="button"
            ngbDropdownItem
            class="btn btn-sm"
            (click)="Delete()"
          >
            <i class="ri-delete-bin-line align-bottom me-2 text-muted"></i>
            Delete
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
    `,
  ],
})
export class CustomerServiceRequirementsFormsComponent {
  private params!: ICellRendererParams;
  private comp!: CustomerServiceRequirementsComponent;
  constructor(private message: MessagesService) {}

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  Delete() {
    this.message
      .confirm("Sure!", "You Want To Delete?!", "primary", "question")
      .then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
          this.comp.DeleteCompanyRequirements(this.params.data.sno);
        } else {
          return;
        }
      });
  }
}
