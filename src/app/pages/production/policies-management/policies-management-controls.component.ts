import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ICellRendererParams } from "ag-grid-community";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { SalesLeadStatus } from "src/app/shared/app/models/BusinessDevelopment/business-development-util";
import { PoliciesManagementComponent } from "./policies-management.component";
import { MessagesService } from "src/app/shared/services/messages.service";
import { SweetAlertResult } from "sweetalert2";

@Component({
	selector: "app-policies-management-controls",
	template: `
		<div class="col">
			<div ngbDropdown class="d-inline-block">
				<button type="button" class="btn btn-ghost-secondary waves-effect rounded-pill" id="actionDropdown" ngbDropdownToggle>
					<i class="ri-more-2-fill"></i>
				</button>
				<div ngbDropdownMenu aria-labelledby="actionDropdown" class="dropdown-menu">
					<button ngbDropdownItem (click)="View()" class="btn btn-sm">View</button>
					<button ngbDropdownItem (click)="Edit()" class="btn btn-sm">Edit</button>
				</div>
			</div>
		</div>
	`,
	styles: ["#actionDropdown::after {display: none}"],
})
export class PoliciesManagementControlsComponent {
	private params!: ICellRendererParams;
	private comp!: PoliciesManagementComponent;

	route: string = AppRoutes.Production.details;
	leadStatus: any = SalesLeadStatus;
	constructor(private _Router: Router, private message: MessagesService) {}

	agInit(params: ICellRendererParams) {
		this.params = params;
		this.comp = this.params.context.comp;
	}

	View() {
		this._Router.navigate([{ outlets: { details: [this.route, this.params.data.identity] } }]);
	}

	Edit() {
		this._Router.navigate([AppRoutes.Production.edit, this.params.data.identity]);
	}
}
