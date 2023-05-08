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
import { MessagesService } from "src/app/shared/services/messages.service";
import { ReportsViewerComponent } from "src/app/shared/components/reports-viewer/reports-viewer.component";
import { IPolicyRenewalReportForm, IPolicyRenewalReportReq } from "src/app/shared/app/models/Production/ipolicy-renewal-report";
import { ProductionService } from "src/app/shared/services/production/production.service";
import { NavigationStart, Router } from "@angular/router";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { Roles } from "src/app/core/roles/Roles";
@Component({
	selector: "app-production-renewal-report",
	templateUrl: "./production-renewal-report.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./production-renewal-report.component.scss"],
})
export class ProductionRenewalReportComponent implements OnInit, OnDestroy {
	url!: any;
	filterForm!: FormGroup<IPolicyRenewalReportForm>;
	checkAllStatus: FormControl<boolean | null> = new FormControl(false);
	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		checkAllControls: {
			allBranchControl: new FormControl(false),
			allInsuranceCompanyControl: new FormControl(false),
			allClassOfBusinessControl: new FormControl(false),
		},
		lists: {
			branchesLists: [] as IGenericResponseType[],
			insuranceCompanyControlLists: [] as IGenericResponseType[],
			classOfBusinessLists: [] as IGenericResponseType[],
			clientsList: [] as IGenericResponseType[],
			producersList: [] as IGenericResponseType[],
		},
		clientDataContorl: new FormControl("Select All"),
		privileges: ProductionPermissions,
	};
	permissions$!: Observable<string[]>;
	modalRef!: NgbModalRef;

	constructor(
		private modalService: NgbModal,
		private productionService: ProductionService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private utils: AppUtils,
		private router: Router,
		private permission: PermissionsService,
		private auth: AuthenticationService
	) {}

	ngOnInit(): void {
		this.permissions$ = this.permission.getPrivileges(Roles.Production);

		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.Production);
		let sub = this.lookupData.subscribe((res) => {
			this.uiState.lists.branchesLists = res.Branch?.content!;
			this.uiState.lists.insuranceCompanyControlLists = res.InsuranceCompanies?.content!;
			this.uiState.lists.classOfBusinessLists = res.InsurClasses?.content!;
			res.ClientsList?.content! ? (this.uiState.lists.clientsList = [{ id: 0, name: "Select All" }, ...res.ClientsList?.content!]) : "";
			res.Producers?.content! ? (this.uiState.lists.producersList = [{ id: 0, name: "Select All" }, ...res.Producers?.content!]) : "";
		});

		// let sub2 = this.router.events.subscribe((event) => {
		// 	if (event instanceof NavigationStart) {
		// 		this.modalService.hasOpenModals() ? this.modalRef.close() : "";
		// 	}
		// });

		let sub2 = this.permissions$.subscribe((res: string[]) => {
			if (!res.includes(this.uiState.privileges.ChAccessAllProducersProduction)) {
				this.f.producer?.patchValue(this.auth.getUser().name!);
				this.f.producer?.disable();
			}

			if (!res.includes(this.uiState.privileges.ViewAllBranchs)) {
				this.uiState.checkAllControls.allBranchControl.disable();
				this.f.branchs?.patchValue([this.auth.getUser().Branch!]);
			} else {
				this.uiState.checkAllControls.allBranchControl.patchValue(true);
				if (this.uiState.lists.branchesLists != undefined && this.uiState.lists.branchesLists.length > 0) this.checkAllToggler(true, "branch");
			}

			if (this.uiState.lists.insuranceCompanyControlLists != undefined && this.uiState.lists.insuranceCompanyControlLists.length > 0) {
				this.uiState.checkAllControls.allInsuranceCompanyControl.patchValue(true);
				this.checkAllToggler(true, "insuranceCompany");
			}

			if (this.uiState.lists.classOfBusinessLists != undefined && this.uiState.lists.classOfBusinessLists.length > 0) {
				this.uiState.checkAllControls.allClassOfBusinessControl.patchValue(true);
				this.checkAllToggler(true, "classOfBusiness");
			}

			this.eventService.broadcast(reserved.isLoading, false);
		});
		this.subscribes.push(sub, sub2);

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
		this.filterForm = new FormGroup<IPolicyRenewalReportForm>({
			branchs: new FormControl([]),
			insuranceCompany: new FormControl([]),
			classOfBusiness: new FormControl([]),
			producer: new FormControl("Select All"),
			clientData: new FormControl(null),
			minDate: new FormControl(null, Validators.required),
			maxDate: new FormControl(null, Validators.required),
		});
	}

	setClientData(e: any) {
		let data = `${e.id}, ${e.name}`;
		this.f.clientData?.patchValue(data);
	}

	checkAllToggler(check: boolean, controlName: string) {
		switch (controlName) {
			case "branch":
				if (check) this.f.branchs?.patchValue(this.uiState.lists.branchesLists.map((e) => e.name));
				else this.f.branchs?.patchValue([]);
				break;
			case "insuranceCompany":
				if (check) this.f.insuranceCompany?.patchValue(this.uiState.lists.insuranceCompanyControlLists.map((e) => e.name));
				else this.f.insuranceCompany?.patchValue([]);
				break;
			case "classOfBusiness":
				if (check) this.f.classOfBusiness?.patchValue(this.uiState.lists.classOfBusinessLists.map((e) => e.name));
				else this.f.classOfBusiness?.patchValue([]);
				break;
			default:
				break;
		}
	}

	ngSelectChange(listName: string) {
		switch (listName) {
			case "insuranceCompany":
				this.f.insuranceCompany?.value?.length! < this.uiState.lists.insuranceCompanyControlLists.length
					? this.uiState.checkAllControls.allInsuranceCompanyControl.patchValue(false)
					: this.f.insuranceCompany?.value?.length! == this.uiState.lists.insuranceCompanyControlLists.length
					? this.uiState.checkAllControls.allInsuranceCompanyControl.patchValue(true)
					: "";
				break;

			case "branch":
				this.f.branchs?.value?.length! < this.uiState.lists.branchesLists.length
					? this.uiState.checkAllControls.allBranchControl.patchValue(false)
					: this.f.branchs?.value?.length! == this.uiState.lists.branchesLists.length
					? this.uiState.checkAllControls.allBranchControl.patchValue(true)
					: "";
				break;
			case "classOfBusiness":
				this.f.classOfBusiness?.value?.length! < this.uiState.lists.classOfBusinessLists.length
					? this.uiState.checkAllControls.allClassOfBusinessControl.patchValue(false)
					: this.f.classOfBusiness?.value?.length! == this.uiState.lists.classOfBusinessLists.length
					? this.uiState.checkAllControls.allClassOfBusinessControl.patchValue(true)
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
	onSubmit(filterForm: FormGroup<IPolicyRenewalReportForm>) {
		this.submitted = true;
		if (this.filterForm?.invalid) {
			return;
		}
		// Display Submitting Loader
		this.eventService.broadcast(reserved.isLoading, true);
		const data: IPolicyRenewalReportReq = {
			...filterForm.getRawValue(),
			clientData: this.uiState.clientDataContorl.getRawValue() === "Select All" ? null : filterForm.getRawValue().clientData,
			producer: filterForm.getRawValue().producer === "Select All" ? null : filterForm.getRawValue().producer,
			minDate: this.utils.dateFormater(filterForm.getRawValue().minDate) as any,
			maxDate: this.utils.dateFormater(filterForm.getRawValue().maxDate) as any,
		};

		let sub = this.productionService.viewRenewalReport(data).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
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
		// 	reportName: "Policies Reports - Renewals",
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
		this.f.branchs?.patchValue([]);
		this.f.classOfBusiness?.patchValue([]);
		this.f.insuranceCompany?.patchValue([]);
		this.f.producer?.patchValue("Select All");
		this.submitted = false;
	}
}
