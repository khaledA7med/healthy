import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ICellRendererParams } from "ag-grid-community";
import { SystemAdminStatus } from "src/app/shared/app/models/SystemAdmin/system-admin-utils";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { MessagesService } from "src/app/shared/services/messages.service";
import { SweetAlertResult } from "sweetalert2";
import { UserPrivilegesComponent } from "./user-privileges.component";

@Component({
	selector: "app-user-accounts-management-controls",
	template: `
		<div class="col">
			<button type="button" (click)="delete()" class="btn btn-ghost-secondary waves-effect rounded-pill">
				<i class="ri-delete-bin-2-fill"></i>
			</button>
		</div>
	`,
	styles: [``],
})
export class UserRolesManagementControlsComponent {
	private params!: ICellRendererParams;
	private comp!: UserPrivilegesComponent;

	route: string = AppRoutes.Production.details;
	adminStatus: any = SystemAdminStatus;

	constructor(private _Router: Router, private message: MessagesService) {}

	agInit(params: ICellRendererParams) {
		this.params = params;
		this.comp = this.params.context.comp;
	}

	delete() {
		this.message.confirm("Sure!", "Reset Password?!", "primary", "question").then((result: SweetAlertResult) => {
			if (result.isConfirmed) {
				this.comp.deleteRole(this.params.data.sno);
			} else {
				return;
			}
		});
	}
}
