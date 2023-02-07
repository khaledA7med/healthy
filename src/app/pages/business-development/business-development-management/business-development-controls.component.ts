import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ICellRendererParams } from "ag-grid-community";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { SalesLeadStatus } from "src/app/shared/app/models/BusinessDevelopment/business-development-util";
import { BusinessDevelopmentManagementComponent } from "./business-development-management.component";
import { MessagesService } from "src/app/shared/services/messages.service";
import { SweetAlertResult } from "sweetalert2";
@Component({
	selector: "app-business-development-controls",
	template: `
		<div class="col">
			<div ngbDropdown class="d-inline-block">
				<button type="button" class="btn btn-ghost-secondary waves-effect rounded-pill" id="actionDropdown" ngbDropdownToggle>
					<i class="ri-more-2-fill"></i>
				</button>
				<div ngbDropdownMenu aria-labelledby="actionDropdown" class="dropdown-menu">
					<button ngbDropdownItem (click)="FollowUp()" class="btn btn-sm">Follow Up</button>
					<button ngbDropdownItem (click)="Edit()" class="btn btn-sm">Edit</button>
					<li>
						<a class="btn btn-sm dropdown-item">Change Status To &nbsp; &nbsp; &raquo;</a>
						<ul class="dropdown-menu dropdown-submenu">
							<li>
								<button (click)="changeLeadStatus(leadStatus.Prospect)" class="btn btn-sm dropdown-item">{{ leadStatus.Prospect }}</button>
							</li>
							<li>
								<button (click)="changeLeadStatus(leadStatus.Confirmed)" class="btn btn-sm dropdown-item">{{ leadStatus.Confirmed }}</button>
							</li>
							<li>
								<button (click)="changeLeadStatus(leadStatus.Quoting)" class="btn btn-sm dropdown-item">{{ leadStatus.Quoting }}</button>
							</li>
							<li>
								<button (click)="changeLeadStatus(leadStatus.PendingwithUnderwriting)" class="btn btn-sm dropdown-item">
									{{ leadStatus.PendingwithUnderwriting }}
								</button>
							</li>
							<li>
								<button (click)="changeLeadStatus(leadStatus.Lost)" class="btn btn-sm dropdown-item">{{ leadStatus.Lost }}</button>
							</li>
							<li>
								<button (click)="changeLeadStatus(leadStatus.WaitingForClientFeedback)" class="btn btn-sm dropdown-item">
									{{ leadStatus.WaitingForClientFeedback }}
								</button>
							</li>
						</ul>
					</li>
				</div>
			</div>
		</div>
	`,
	// styles: ["#actionDropdown::after {display: none}"],
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
	],
})
export class BusinessDevelopmentControlsComponent {
	private params!: ICellRendererParams;
	private comp!: BusinessDevelopmentManagementComponent;

	// route: string = AppRoutes.Client.clientRegistry;
	leadStatus: any = SalesLeadStatus;
	constructor(private _Router: Router, private message: MessagesService) {}

	agInit(params: ICellRendererParams) {
		this.params = params;
		this.comp = this.params.context.comp;
	}

	FollowUp() {
		this.comp.openSalesLeadFollowUp(this.params.data.leadNo);
	}

	Edit() {
		this._Router.navigate([AppRoutes.Client.clientEdit, this.params.data.identity]);
	}

	changeLeadStatus(status: string) {
		this.message.confirm("Yes, Sure!", "Are You Sure To Change Status?!", "primary", "question").then((result: SweetAlertResult) => {
			if (result.isConfirmed) {
				this.comp.changeStatus(this.params.data, status);
			} else {
				return;
			}
		});
	}
}
