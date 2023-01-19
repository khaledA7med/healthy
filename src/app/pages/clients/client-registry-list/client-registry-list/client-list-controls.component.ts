import { Component } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";

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
          <button ngbDropdownItem (click)="Edit()" class="btn btn-sm">
            Edit
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ["#actionDropdown::after {display: none}"],
})
export class ClientListControlsComponent {
  private params!: ICellRendererParams;

  agInit(params: ICellRendererParams) {
    this.params = params;
  }

  Edit() {}

  view() {}
}
