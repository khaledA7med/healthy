import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ICellRendererParams } from "ag-grid-community";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { SalesLeadStatus } from "src/app/shared/app/models/BusinessDevelopment/business-development-util";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { Roles } from "src/app/core/roles/Roles";
import { Observable } from "rxjs";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { PoliciesManagementComponent } from "./policies-management.component";

@Component({
	selector: "app-policies-management-controls",
	template: `
		<div class="col d-flex align-items-center justify-content-center">
			<div ngbDropdown class="d-inline-block">
				<button type="button" class="btn btn-sm btn-ghost-secondary waves-effect rounded-pill" id="actionDropdown" ngbDropdownToggle>
					<i class="ri-more-2-fill"></i>
				</button>
				<div ngbDropdownMenu aria-labelledby="actionDropdown" class="dropdown-menu">
					<button ngbDropdownItem (click)="View()" class="btn btn-sm">View</button>
					<button ngbDropdownItem (click)="Edit()" class="btn btn-sm" *ngIf="(permissions$ | async)?.includes(privileges.ChEntryCorrection)">
						Edit
					</button>
				</div>
			</div>
		</div>
	`,
	styles: ["#actionDropdown::after {display: none}"],
})
export class PoliciesManagementControlsComponent {
	private params!: ICellRendererParams;
	public comp!: PoliciesManagementComponent;
	permissions$!: Observable<string[]>;
	privileges = ProductionPermissions;
	route: string = AppRoutes.Production.details;
	leadStatus: any = SalesLeadStatus;
	constructor(private _Router: Router, private permission: PermissionsService) {}

	agInit(params: ICellRendererParams) {
		this.params = params;
		this.comp = this.params.context.comp;
		this.permissions$ = this.permission.getPrivileges(Roles.Production);
	}

	View() {
		// this._Router.navigate([
		//   { outlets: { details: [this.route, this.params.data.identity] } },
		// ]);
		this.comp.openPolicyPreview(this.params.data.identity);
	}

	Edit() {
		this._Router.navigate([AppRoutes.Production.edit, this.params.data.identity]);
	}
}
