import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import AppUtils from "src/app/shared/app/util";
import { BusinessDevelopmentService } from "src/app/shared/services/business-development/business-development.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ReportsViewerComponent } from "src/app/shared/components/reports-viewer/reports-viewer.component";

import {
	IBusinessDevelopmentProspectsReportForm,
	IBusinessDevelopmentProspectsReportReq,
} from "src/app/shared/app/models/BusinessDevelopment/ibusiness-development-prospects-report";
import { NavigationStart, Router } from "@angular/router";
import { BusinessDevelopmentPermissions } from "src/app/core/roles/business-development-permissions";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { Roles } from "src/app/core/roles/Roles";

@Component({
	selector: "app-business-development-prospects-reports",
	templateUrl: "./business-development-prospects-reports.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./business-development-prospects-reports.component.scss"],
})
export class BusinessDevelopmentProspectsReportsComponent implements OnInit, OnDestroy {
	url!: any;
	filterForm!: FormGroup<IBusinessDevelopmentProspectsReportForm>;
	checkAllStatus: FormControl<boolean | null> = new FormControl(false);
	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		checkAllControls: {
			allBranchControl: new FormControl(false),
			allProducersControl: new FormControl(false),
			allClassOfBusinessControl: new FormControl(false),
		},
		lists: {
			branchesLists: [] as IGenericResponseType[],
			producersLists: [] as IGenericResponseType[],
			classOfBusinessLists: [] as IGenericResponseType[],
		},
		privileges: BusinessDevelopmentPermissions,
	};
	permissions$!: Observable<string[]>;
	modalRef!: NgbModalRef;
	constructor(
		private modalService: NgbModal,
		private BusinessDevelopmentService: BusinessDevelopmentService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private utils: AppUtils,
		private router: Router,
		private permission: PermissionsService,
		private auth: AuthenticationService
	) {}

	ngOnInit(): void {
		this.eventService.broadcast(reserved.isLoading, true);
		this.permissions$ = this.permission.getPrivileges(Roles.BusinessDevelopment);

		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.BusinessDevelopment);
		let sub = this.lookupData.subscribe((res) => {
			this.uiState.lists.branchesLists = res.Branch?.content!;
			this.uiState.lists.producersLists = res.Producers?.content!;
			this.uiState.lists.classOfBusinessLists = res.InsurClasses?.content!;

			if (this.uiState.lists.classOfBusinessLists != undefined && this.uiState.lists.classOfBusinessLists.length > 0) {
				this.uiState.checkAllControls.allClassOfBusinessControl.patchValue(true);
				this.checkAllToggler(true, "classOfBusiness");
			}

			let sub2 = this.permissions$.subscribe((res: string[]) => {
				if (!res.includes(this.uiState.privileges.ChAccessAllBranchBussiness)) {
					this.uiState.checkAllControls.allBranchControl.disable();
					this.f.branchs?.patchValue([this.auth.getUser().Branch!]);
				} else {
					this.uiState.checkAllControls.allBranchControl.patchValue(true);
					if (this.uiState.lists.branchesLists != undefined && this.uiState.lists.branchesLists.length > 0) this.checkAllToggler(true, "branch");
				}
				if (!res.includes(this.uiState.privileges.ChAccessAllProducersSales)) {
					this.uiState.checkAllControls.allProducersControl.disable();
					this.f.producers?.patchValue([this.auth.getUser().name!]);
				} else {
					this.uiState.checkAllControls.allProducersControl.patchValue(true);
					if (this.uiState.lists.producersLists != undefined && this.uiState.lists.producersLists.length > 0) this.checkAllToggler(true, "producer");
				}
				this.eventService.broadcast(reserved.isLoading, false);
			});
			this.subscribes.push(sub2);
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

	initFilterForm() {
		this.filterForm = new FormGroup<IBusinessDevelopmentProspectsReportForm>({
			branchs: new FormControl([]),
			producers: new FormControl([]),
			classofBusiness: new FormControl([]),
			reportType: new FormControl(1, Validators.required),
			minDate: new FormControl(null, Validators.required),
			maxDate: new FormControl(null, Validators.required),
		});
	}

	checkAllToggler(check: boolean, controlName: string) {
		switch (controlName) {
			case "branch":
				if (check) this.f.branchs?.patchValue(this.uiState.lists.branchesLists.map((e) => e.name));
				else this.f.branchs?.patchValue([]);
				break;
			case "producer":
				if (check) this.f.producers?.patchValue(this.uiState.lists.producersLists.map((e) => e.name));
				else this.f.producers?.patchValue([]);
				break;
			case "classOfBusiness":
				if (check) this.f.classofBusiness?.patchValue(this.uiState.lists.classOfBusinessLists.map((e) => e.name));
				else this.f.classofBusiness?.patchValue([]);
				break;
			default:
				break;
		}
	}

	ngSelectChange(listName: string) {
		switch (listName) {
			case "classOfBusiness":
				this.f.classofBusiness?.value?.length! < this.uiState.lists.classOfBusinessLists.length
					? this.uiState.checkAllControls.allClassOfBusinessControl.patchValue(false)
					: this.f.classofBusiness?.value?.length! == this.uiState.lists.classOfBusinessLists.length
					? this.uiState.checkAllControls.allClassOfBusinessControl.patchValue(true)
					: "";
				break;

			case "producers":
				this.f.producers?.value?.length! < this.uiState.lists.producersLists.length
					? this.uiState.checkAllControls.allProducersControl.patchValue(false)
					: this.f.producers?.value?.length! == this.uiState.lists.producersLists.length
					? this.uiState.checkAllControls.allProducersControl.patchValue(true)
					: "";
				break;

			case "branch":
				this.f.branchs?.value?.length! < this.uiState.lists.branchesLists.length
					? this.uiState.checkAllControls.allBranchControl.patchValue(false)
					: this.f.branchs?.value?.length! == this.uiState.lists.branchesLists.length
					? this.uiState.checkAllControls.allBranchControl.patchValue(true)
					: "";
				break;
			default:
				return;
		}
	}

	minDate(e: any) {
		this.f.minDate?.patchValue(e.gon);
	}

	maxDate(e: any) {
		this.f.maxDate?.patchValue(e.gon);
	}

	get f() {
		return this.filterForm.controls;
	}

	onSubmit(filterForm: FormGroup<IBusinessDevelopmentProspectsReportForm>) {
		this.submitted = true;
		if (this.filterForm?.invalid) {
			return;
		}
		// Display Submitting Loader
		this.eventService.broadcast(reserved.isLoading, true);
		const data: IBusinessDevelopmentProspectsReportReq = {
			...filterForm.getRawValue(),
			minDate: this.utils.dateFormater(filterForm.getRawValue().minDate) as any,
			maxDate: this.utils.dateFormater(filterForm.getRawValue().maxDate) as any,
		};

		let sub = this.BusinessDevelopmentService.viewProspectsReport(data).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
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

	openReportsViewer(data?: string): void {
		// this.modalRef = this.modalService.open(ReportsViewerComponent, { fullscreen: true, scrollable: true });
		// this.modalRef.componentInstance.data = {
		// 	reportName: "Prospects Reports",
		// 	url: data,
		// };
		const myWindow = window.open(data, "_blank", "fullscreen: true");
		const content = `		
						<!DOCTYPE html>
						<html lang="en">
							<head>
								<title>Prospects Reports</title>
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

	resetForm() {
		this.filterForm.reset();
		this.f.classofBusiness?.patchValue([]);
		this.f.branchs?.patchValue([]);
		this.f.producers?.patchValue([]);
		this.f.reportType?.patchValue(1);
		this.submitted = false;
	}
}
