import { Component } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { SalesLeadStatus } from "src/app/shared/app/models/BusinessDevelopment/business-development-util";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { Roles } from "src/app/core/roles/Roles";
import { Observable, Subscription } from "rxjs";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { PoliciesManagementComponent } from "./policies-management.component";
import { DCNotesModel } from "src/app/shared/app/models/Production/production-util";
import { ProductionService } from "src/app/shared/services/production/production.service";
import AppUtils from "src/app/shared/app/util";
import { HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";

@Component({
	selector: "app-policies-print-note",
	template: `
		<div class="col d-flex align-items-center justify-content-center">
			<button ngbDropdownItem (click)="print()" class="btn btn-sm btn-success" *ngIf="params.plain">Print Debit/Credit Note (Plain)</button>
			<button ngbDropdownItem (click)="print()" class="btn btn-sm btn-info" *ngIf="!params.plain">Print Debit/Credit Note (Without Plain)</button>
		</div>
	`,
	styles: ["#actionDropdown::after {display: none}"],
})
export class PoliciesPrintNoteComponent {
	public params!: any;
	permissions$!: Observable<string[]>;
	privileges = ProductionPermissions;
	route: string = AppRoutes.Production.details;
	leadStatus: any = SalesLeadStatus;
	subscribes: Subscription[] = [];
	constructor(
		private permission: PermissionsService,
		private message: MessagesService,
		private productionService: ProductionService,
		private eventService: EventService,
		private utils: AppUtils
	) {}

	agInit(params: ICellRendererParams) {
		this.params = params;
		this.permissions$ = this.permission.getPrivileges(Roles.Production);
	}

	print() {
		let newData: DCNotesModel = {
			docSNo: this.params.data.clientDncnno,
			clientName: this.params.data.clientName,
			type: this.params.data.endorsType,
			source: "Production",
			plain: this.params.plain,
			userFullName: this.params.data.approvedUser,
			pram: this.params.data.pram,
			reportType: this.params.data.reportType,
		};

		let sub = this.productionService.viewDebitCreditNoteReport(newData).subscribe((res: HttpResponse<IBaseResponse<string>>) => {
			if (res.ok) {
				this.utils.reportViewer(res.body?.data!, "ٌDebit/Credit Note Report");
			} else {
				this.message.popup("Oops!", res.body?.message!, "error");
			}
			this.eventService.broadcast(reserved.isLoading, false);
		});
		this.subscribes.push(sub);
	}
}
