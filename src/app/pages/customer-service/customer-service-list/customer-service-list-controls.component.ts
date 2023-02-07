import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { ICellRendererParams } from "ag-grid-community";
import { AppRoutes } from 'src/app/shared/app/routers/appRouters';

@Component({
  selector: 'app-customer-service-list-controls',
  template: `
  <div class="col">
			<div ngbDropdown class="d-inline-block">
				<button type="button" class="btn btn-ghost-secondary waves-effect rounded-pill" id="actionDropdown" ngbDropdownToggle>
					<i class="ri-more-2-fill"></i>
				</button>
				<div ngbDropdownMenu aria-labelledby="actionDropdown">
					<button ngbDropdownItem (click)="Edit()" class="btn btn-sm">Notify By Email</button>
					<button ngbDropdownItem (click)="Edit()" class="btn btn-sm">Follow Up</button>
					<button ngbDropdownItem (click)="Edit()" class="btn btn-sm">Edit</button>
					<button ngbDropdownItem (click)="Edit()" class="btn btn-sm">Make Invoice</button>
					<button ngbDropdownItem (click)="Edit()" class="btn btn-sm">Change Status To</button>
				</div>
			</div>
		</div>
`,
  styles: [ "#actionDropdown::after {display: none}" ],
})
export class CustomerServiceListControlsComponent
{
  private params!: ICellRendererParams;
  route: string = AppRoutes.Client.clientRegistry;

  constructor (private _Router: Router) { }

  agInit (params: ICellRendererParams)
  {
    this.params = params;
  }
  Edit ()
  {
    this._Router.navigate([
      AppRoutes.Client.clientEdit,
      this.params.data.identity,
    ]);
  }

  view ()
  {
    // this._Router.navigate([
    //   { outlets: { details: [ this.route, this.params.data.sNo ] } },
    // ]);
  }

}
