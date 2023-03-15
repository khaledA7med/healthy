import { Component } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { MessagesService } from "src/app/shared/services/messages.service";
import { SweetAlertResult } from 'sweetalert2';
import { ClaimsStatusComponent } from './claims-status.component';

@Component({
  selector: 'app-claims-status-forms',
  template: `
    <div class="col">
  <div ngbDropdown class="d-inline-block">
    <button type="button" class="btn btn-ghost-secondary waves-effect rounded-pill" id="actionDropdown" ngbDropdownToggle>
      <i class="ri-more-2-fill"></i>
    </button>
    <div ngbDropdownMenu aria-labelledby="actionDropdown" class="dropdown-menu">
      <button ngbDropdownItem  class="btn btn-sm" (click)="Edit()"><i class="ri-edit-line align-bottom me-2 text-muted"></i> Edit</button>
      <button ngbDropdownItem  class="btn btn-sm" (click)="Delete()"><i class="ri-delete-bin-line align-bottom me-2 text-muted"></i> Delete</button>
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
  ]
})
export class ClaimsStatusFormsComponent
{

  private params!: ICellRendererParams;
  private comp!: ClaimsStatusComponent;
  constructor (private message: MessagesService) { }

  agInit (params: ICellRendererParams)
  {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  Edit ()
  {
    this.comp.openClaimsStatusDialoge(this.params.data.sno);
  }

  Delete ()
  {
    this.message.confirm("Sure!", "You Want To Delete?!", "primary", "question").then((result: SweetAlertResult) =>
    {
      if (result.isConfirmed)
      {
        this.comp.DeleteClaimsStatus(this.params.data.sno);
      } else
      {
        return;
      }
    });
  }

}
