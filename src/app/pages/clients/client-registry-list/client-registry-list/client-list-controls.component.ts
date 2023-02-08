import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { ICellRendererParams } from "ag-grid-community";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
@Component({
	selector: "app-client-list-controls",
	template: `
		<div class="col">
			<div ngbDropdown class="d-inline-block">
				<button type="button" class="btn btn-ghost-secondary waves-effect rounded-pill" id="actionDropdown" ngbDropdownToggle>
					<i class="ri-more-2-fill"></i>
				</button>
				<div ngbDropdownMenu aria-labelledby="actionDropdown">
					<button ngbDropdownItem (click)="Edit()" class="btn btn-sm">Edit</button>
					<button ngbDropdownItem (click)="view()" class="btn btn-sm">View</button>
				</div>
			</div>
		</div>
	`,
	styles: ["#actionDropdown::after {display: none}"],
})
export class ClientListControlsComponent {
	private params!: ICellRendererParams;
	route: string = AppRoutes.Client.clientRegistry;

	constructor(private _Router: Router) {}

	agInit(params: ICellRendererParams) {
		this.params = params;
	}

	Edit() {
		this._Router.navigate([AppRoutes.Client.clientEdit, this.params.data.identity]);
	}

	view() {
		this._Router.navigate([{ outlets: { details: [this.route, this.params.data.identity] } }]);
	}
}
