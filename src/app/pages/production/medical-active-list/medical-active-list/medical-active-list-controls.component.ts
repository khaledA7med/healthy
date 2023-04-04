import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ICellRendererParams } from "ag-grid-community";
import { MedicalActiveListComponent } from "./medical-active-list.component";

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

  constructor(private _Router: Router) {}

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  View() {
    this.comp.openMedicalActivePreview(this.params.data.identity);
  }
}
