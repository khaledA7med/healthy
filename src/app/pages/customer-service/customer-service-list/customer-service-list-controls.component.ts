import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { ICellRendererParams } from "ag-grid-community";
import { CustomerServiceStatus } from 'src/app/shared/app/models/CustomerService/icustomer-service-utils';
import { AppRoutes } from 'src/app/shared/app/routers/appRouters';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { SweetAlertResult } from 'sweetalert2';
import { CustomerServiceListComponent } from './customer-service-list.component';

@Component({
  selector: 'app-customer-service-list-controls',
  template: `
  <div class="col">
			<div ngbDropdown class="d-inline-block">
				<button type="button" class="btn btn-ghost-secondary waves-effect rounded-pill" id="actionDropdown" ngbDropdownToggle>
					<i class="ri-more-2-fill"></i>
				</button>
				<div ngbDropdownMenu aria-labelledby="actionDropdown" class="dropdown-menu">
        <li>
        <a class="btn btn-sm dropdown-item">Notify By Email &nbsp; &nbsp; &raquo;</a>
        <ul class="dropdown-menu dropdown-submenu">
          <li>
            <button class="btn btn-sm dropdown-item">Cient</button>
          </li>
          <li>
            <button class="btn btn-sm dropdown-item">Insurer</button>
          </li>
        </ul>
      </li>
					<button ngbDropdownItem (click)="FollowUp()" class="btn btn-sm">Follow Up</button>
					<button ngbDropdownItem class="btn btn-sm">Edit</button>
					<button ngbDropdownItem class="btn btn-sm">Make Invoice</button>
					<li>
						<a class="btn btn-sm dropdown-item">Change Status To &nbsp; &nbsp; &raquo;</a>
						<ul class="dropdown-menu dropdown-submenu">
							<li>
								<button (click)="changeCsStatus(status.Pending)" class="btn btn-sm dropdown-item">{{ status.Pending }}</button>
							</li>
							<li>
								<button (click)="changeCsStatus(status.Close)" class="btn btn-sm dropdown-item">{{ status.Close }}</button>
							</li>
							<li>
								<button (click)="changeCsStatus(status.Cancel)" class="btn btn-sm dropdown-item">{{ status.Cancel }}</button>
							</li>
						</ul>
					</li>
				</div>
			</div>
		</div>
`,
  styles: [
    `#actionDropdown::after {display: none}
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
    }`
  ],
})
export class CustomerServiceListControlsComponent
{
  private params!: ICellRendererParams;
  private comp!: CustomerServiceListComponent;

  status: any = CustomerServiceStatus;



  constructor (private _Router: Router,
    private message: MessagesService,
  ) { }

  agInit (params: ICellRendererParams)
  {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  FollowUp ()
  {
    this.comp.openCustomerServiceFollowUp(this.params.data.requestNo);
  }

  changeCsStatus (status: string)
  {
    this.message.confirm("Yes, Sure!", "Are You Sure To Change Status?!", "primary", "question").then((result: SweetAlertResult) =>
    {
      if (result.isConfirmed)
      {
        this.comp.changeStatus(this.params.data, status);
      } else
      {
        return;
      }
    });
  }

}
