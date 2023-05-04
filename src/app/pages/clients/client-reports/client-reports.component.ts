import { HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ClientsService } from "src/app/shared/services/clients/clients.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ReportsViewerComponent } from "src/app/shared/components/reports-viewer/reports-viewer.component";
import { IClientReportFiltersForm, IClientReportReq } from "src/app/shared/app/models/Clients/iclient-report";
import AppUtils from "src/app/shared/app/util";
import { NavigationStart, Router } from "@angular/router";
import { ClientsPermissions } from "src/app/core/roles/clients-permissions";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { Roles } from "src/app/core/roles/Roles";
import { AuthenticationService } from "src/app/core/services/auth.service";

@Component({
	selector: "app-client-reports",
	templateUrl: "./client-reports.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./client-reports.component.scss"],
})
export class ClientReportsComponent implements OnInit, OnDestroy {
	url!: any;
	filterForms!: FormGroup<IClientReportFiltersForm>;

	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		checkAllContorls: {
			checkAllStatus: new FormControl(false),
			checkAllBranches: new FormControl(false),
		},
		lists: {
			clientStatus: [] as IGenericResponseType[],
			crNoList: [] as IGenericResponseType[],
			producersList: [] as IGenericResponseType[],
			typesList: [] as IGenericResponseType[],
			branchesLists: [] as IGenericResponseType[],
		},
		privileges: ClientsPermissions,
	};
	permissions$!: Observable<string[]>;

	modalRef!: NgbModalRef;
	constructor(
		private modalService: NgbModal,
		private ClientsService: ClientsService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private utils: AppUtils,
		private router: Router,
		private permission: PermissionsService,
		private auth: AuthenticationService
	) {}

	ngOnInit(): void {
		this.permissions$ = this.permission.getPrivileges(Roles.Clients);

		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.Client);

		let sub = this.lookupData.subscribe((res) => {
			this.uiState.lists.clientStatus = res.ClientStatus?.content!;
			this.uiState.lists.branchesLists = res.Branch?.content!;
			this.uiState.checkAllContorls.checkAllBranches.patchValue(true);
			this.uiState.checkAllContorls.checkAllStatus.patchValue(true);
			if (this.uiState.lists.branchesLists != undefined && this.uiState.lists.branchesLists.length > 0) this.checkAllStatusAction(true, "branch");
			if (this.uiState.lists.clientStatus != undefined && this.uiState.lists.clientStatus.length > 0) this.checkAllStatusAction(true, "status");
			res.CommericalNo?.content! ? (this.uiState.lists.crNoList = [{ id: 0, name: "Select All" }, ...res.CommericalNo?.content!]) : "";
			res.Producers?.content! ? (this.uiState.lists.producersList = [{ id: 0, name: "Select All" }, ...res.Producers?.content!]) : "";
			res.ClientTypes?.content! ? (this.uiState.lists.typesList = [{ id: 0, name: "Select All" }, ...res.ClientTypes?.content!]) : "";
		});
		// let sub2 = this.router.events.subscribe((event) => {
		// 	if (event instanceof NavigationStart) {
		// 		this.modalService.hasOpenModals() ? this.modalRef.close() : "";
		// 	}
		// });
		this.subscribes.push(sub);

		let date = new Date();
		let todayDate = {
			gon: {
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				day: date.getDate(),
			},
		};
		this.minDate(todayDate);
		this.maxDate(todayDate);
	}

	initFilterForm(): void {
		this.filterForms = new FormGroup<IClientReportFiltersForm>({
			status: new FormControl(["Active"], Validators.required),
			name: new FormControl(""),
			accountNumber: new FormControl(""),
			crNO: new FormControl("Select All"),
			producer: new FormControl("Select All"),
			type: new FormControl("Select All"),
			branchs: new FormControl([]),
			minDate: new FormControl(null, Validators.required),
			maxDate: new FormControl(null, Validators.required),
		});
	}

	checkAllStatusAction(check: boolean | null, controlName: string) {
		switch (controlName) {
			case "status":
				if (check) this.f.status?.patchValue(this.uiState.lists.clientStatus.map((e) => e.name));
				else this.f.status?.patchValue(["Active"]);
				break;
			case "branch":
				if (check) this.f.branchs?.patchValue(this.uiState.lists.branchesLists.map((e) => e.name));
				else this.f.branchs?.patchValue(null);
				break;
			default:
				break;
		}
	}
	ngSelectChange(listName: string) {
		switch (listName) {
			case "status":
				this.f.status?.value?.length! < this.uiState.lists.clientStatus.length
					? this.uiState.checkAllContorls.checkAllStatus.patchValue(false)
					: this.f.status?.value?.length! == this.uiState.lists.clientStatus.length
					? this.uiState.checkAllContorls.checkAllStatus.patchValue(true)
					: "";
				break;
			case "branchs":
				this.f.branchs?.value?.length! < this.uiState.lists.branchesLists.length
					? this.uiState.checkAllContorls.checkAllBranches.patchValue(false)
					: this.f.branchs?.value?.length! == this.uiState.lists.branchesLists.length
					? this.uiState.checkAllContorls.checkAllBranches.patchValue(true)
					: "";
				break;
			default:
				return;
		}
	}

	get f() {
		return this.filterForms.controls;
	}

	minDate(e: any) {
		this.f.minDate?.patchValue(e.gon);
	}
	maxDate(e: any) {
		this.f.maxDate?.patchValue(e.gon);
	}

	onSubmit(filterForm: FormGroup<IClientReportFiltersForm>) {
		this.submitted = true;
		if (this.filterForms?.invalid) {
			return;
		}
		const data: IClientReportReq = {
			...filterForm.getRawValue(),
			crNO: filterForm.getRawValue().crNO === "Select All" ? null : filterForm.getRawValue().crNO,
			producer: filterForm.getRawValue().producer === "Select All" ? null : filterForm.getRawValue().producer,
			type: filterForm.getRawValue().type === "Select All" ? null : filterForm.getRawValue().type,
			minDate: this.utils.dateFormater(filterForm.getRawValue().minDate) as any,
			maxDate: this.utils.dateFormater(filterForm.getRawValue().maxDate) as any,
		};
		// Display Submitting Loader
		this.eventService.broadcast(reserved.isLoading, true);
		let sub = this.ClientsService.viewReport(data).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
			if (res.body?.status) {
				this.eventService.broadcast(reserved.isLoading, false);
				this.message.toast(res.body.message!, "success");
				this.openReportsViewer(res.body.data);
			} else this.message.popup("Sorry!", res.body?.message!, "warning");
			// Hide Loader
			this.eventService.broadcast(reserved.isLoading, false);
		});
		this.subscribes.push(sub);
	}

	resetForm(): void {
		this.filterForms.reset();
		this.submitted = false;
	}

	openReportsViewer(data?: string): void {
		// this.modalRef = this.modalService.open(ReportsViewerComponent, { fullscreen: true, scrollable: true });
		// this.modalRef.componentInstance.data = {
		// 	reportName: "Clients Reports",
		// 	url: data,
		// };
		const myWindow = window.open(data, "_blank", "fullscreen: true");
		const content = `		
						<!DOCTYPE html>
						<html lang="en">
							<head>
								<title>Clients Reports</title>
								<link rel="icon" type="image/x-icon" href="assets/images/favicon.ico">
								<style>
								body {height: 98vh;}
								.myIFrame {
								border: none;
								}
								</style>
							</head>
							<body>
								<iframe
								src="${data}"
								class="myIFrame justify-content-center"
								frameborder="5"
								width="100%"
								height="99%"
								referrerpolicy="no-referrer-when-downgrade"
								>
								</iframe>
							</body>
						</html>

		`;
		myWindow?.document.write(content);
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
