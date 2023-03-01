import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { PoliciesEditCommissionsComponent } from './policies-edit-commissions.component';

@Component({
  selector: 'app-policies-edit-commissions-controls',
  template: `
		<div class="col">
			<div ngbDropdown class="d-inline-block">
				<button type="button" class="btn btn-ghost-secondary waves-effect rounded-pill" id="actionDropdown" ngbDropdownToggle>
					<i class="ri-more-2-fill"></i>
				</button>
				<div ngbDropdownMenu aria-labelledby="actionDropdown" class="dropdown-menu">
        <button ngbDropdownItem (click)="Edit()" class="btn btn-sm">
            <i class="ri-edit-line align-bottom me-2 text-muted"></i>
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
    `,
  ],
})
export class PoliciesEditCommissionsControlsComponent
{
  public params!: ICellRendererParams;
  public comp!: PoliciesEditCommissionsComponent;

  constructor () { }

  agInit (params: ICellRendererParams)
  {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  Edit ()
  {
    this.comp.openEditForm(this.params.data.identity);
  }

}
