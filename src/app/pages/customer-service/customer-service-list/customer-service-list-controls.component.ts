import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { ICellRendererParams } from "ag-grid-community";

import { CustomerServiceStatus } from "src/app/shared/app/models/CustomerService/icustomer-service-utils";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { MessagesService } from "src/app/shared/services/messages.service";
import Swal, { SweetAlertResult } from "sweetalert2";
import { CustomerServiceListComponent } from "./customer-service-list.component";

@Component({
	selector: "app-customer-service-list-controls",
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
					<button ngbDropdownItem class="btn btn-sm" (click)="Edit()">Edit</button>
					<button ngbDropdownItem class="btn btn-sm" (click)="makeInvoice()">Make Invoice</button>
					<li>
						<a class="btn btn-sm dropdown-item">Change Status To &nbsp; &nbsp; &raquo;</a>
						<ul class="dropdown-menu dropdown-submenu">
							<li *ngIf="params.data?.status !== status.Pending">
								<a class="btn btn-sm dropdown-item">{{ status.Pending }} &nbsp; &nbsp; &raquo;</a>
								<!-- <button (click)="changeCsStatus(status.Pending)" class="btn btn-sm dropdown-item"></button> -->
								<ul class="dropdown-menu dropdown-submenu">
									<li *ngFor="let el of (comp.lookupData | async)?.PendingReason?.content!">
										<button (click)="changeCsStatus(status.Pending, el.name)" class="btn btn-sm dropdown-item">{{ el.name }}</button>
									</li>
								</ul>
							</li>
							<li *ngIf="params.data?.status !== status.Close">
								<button (click)="changeCsStatus(status.Close)" class="btn btn-sm dropdown-item">{{ status.Close }}</button>
							</li>
							<li *ngIf="params.data?.status !== status.Cancel">
								<button (click)="rejectRequets(status.Cancel)" class="btn btn-sm dropdown-item">{{ status.Cancel }}</button>
							</li>
						</ul>
					</li>
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
	],
})
export class CustomerServiceListControlsComponent {
	public params!: ICellRendererParams;
	public comp!: CustomerServiceListComponent;

	status: any = CustomerServiceStatus;

	constructor(private _Router: Router, private message: MessagesService) {}

	agInit(params: ICellRendererParams) {
		this.params = params;
		this.comp = this.params.context.comp;
	}

	Edit() {
		this._Router.navigate([AppRoutes.CustomerService.edit, this.params.data.identity]);
	}

	makeInvoice() {
		if (this.params.data.status === this.status.Close) {
			// this._Router.navigate([AppRoutes.Production.makeInvoice, `${btoa(this.params.data.policySerial)}/${btoa(this.params.data.clientPolicySno)}`]);
			this._Router.navigate([AppRoutes.Production.makeInvoice, btoa(this.params.data.policySerial), btoa(this.params.data.clientPolicySno)]);
		} else {
			this.message.popup("Warning", "Request must be closed before you can make an invoice", "warning");
		}
	}

	FollowUp() {
		this.comp.openCustomerServiceFollowUp(this.params.data.requestNo);
	}

	changeCsStatus(chStatus: string, reason?: string) {
		this.message.confirm("Sure!", "Change Status?!", "primary", "question").then((result: SweetAlertResult) => {
			if (result.isConfirmed) {
				this.comp.changeStatus(this.params.data, chStatus, reason);
			} else {
				return;
			}
		});
	}

	rejectRequets(status: string): any {
		let reqBody: any;
		return Swal.fire({
			title: "Type Rejection Reason",
			input: "text",
			inputAttributes: {
				required: "true",
			},
			validationMessage: "Required",
			showCancelButton: true,
			background: "var(--vz-modal-bg)",
			customClass: {
				confirmButton: "btn btn-success btn-sm w-xs me-2 mt-2",
				cancelButton: "btn btn-ghost-danger btn-sm w-xs mt-2",
				input: "customize-swlInput",
				validationMessage: "fs-6 bg-transparent  m-1 p-1",
			},
			confirmButtonText: `Reject`,
			buttonsStyling: false,
			showCloseButton: true,
			showLoaderOnConfirm: true,
			allowOutsideClick: false,
			preConfirm: (inputValue: string) => {
				reqBody = {
					...this.params.data,
					rejectionReason: inputValue,
				};
			},
		}).then((result) => {
			if (result.isConfirmed) {
				this.comp.changeStatus(reqBody, status);
			}
		});
	}
}
