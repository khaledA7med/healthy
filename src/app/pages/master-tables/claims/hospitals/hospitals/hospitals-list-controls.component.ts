import { Component } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";
import { MessagesService } from "src/app/shared/services/messages.service";
import { SweetAlertResult } from "sweetalert2";
import { HospitalsComponent } from "./hospitals.component";

@Component({
  selector: "app-hospitals-list-controls",
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
            (click)="Edit()"
          >
            <i class="ri-edit-line align-bottom me-2 text-muted"></i> Edit
          </button>
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
export class HospitalsListControlsComponent {
  private params!: ICellRendererParams;
  public comp!: HospitalsComponent;

  constructor(private message: MessagesService) {}

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  Edit() {
    this.comp.openHospitalsDialoge(this.params.data.sno);
  }

  Delete() {
    this.message
      .confirm("Sure!", "delete?", "primary", "question")
      .then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
          this.comp.DeleteHospitals(this.params.data.sno);
        } else {
          return;
        }
      });
  }
}