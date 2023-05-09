import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import AppUtils from "src/app/shared/app/util";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";
import { IPolicyRenewalNoticeReportForm, IPolicyRenewalNoticeReportReq } from "src/app/shared/app/models/Production/ipolicy-renewal-notice-report";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { Roles } from "src/app/core/roles/Roles";
@Component({
	selector: "app-production-renewal-notice-report",
	templateUrl: "./production-renewal-notice-report.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./production-renewal-notice-report.component.scss"],
})
export class ProductionRenewalNoticeReportComponent implements OnInit, OnDestroy {
	url!: any;
	filterForm!: FormGroup<IPolicyRenewalNoticeReportForm>;
	checkAllStatus: FormControl<boolean | null> = new FormControl(false);
	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		checkAllControls: {
			// allBranchControl: new FormControl(false),
			allInsuranceCompanyControl: new FormControl(false),
			allClassOfBusinessControl: new FormControl(false),
			allLinesOfBusinessControl: new FormControl(false),
		},
		lists: {
			branchesLists: [] as IGenericResponseType[],
			clientsLists: [] as IGenericResponseType[],
			groupsLists: [] as IGenericResponseType[],
			insuranceCompanyControlLists: [] as IGenericResponseType[],
			classOfBusinessLists: [] as IGenericResponseType[],
			linesOfBusinessLists: [] as string[],
		},
		clientDataContorl: new FormControl("Select all"),
		privileges: ProductionPermissions,
		initLineOfBusinessFlag: false,
	};
	permissions$!: Observable<string[]>;
	constructor(
		private productionService: ProductionService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private utils: AppUtils,
		private permission: PermissionsService,
		private auth: AuthenticationService
	) {}

	ngOnInit(): void {
		this.eventService.broadcast(reserved.isLoading, true);
		this.permissions$ = this.permission.getPrivileges(Roles.Production);

		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.Reports);

		let sub = this.lookupData.subscribe((res) => {
			this.uiState.lists.insuranceCompanyControlLists = res.InsuranceCompanies?.content!;
			this.uiState.lists.classOfBusinessLists = res.InsurClasses?.content!;
			res.Branch?.content! ? (this.uiState.lists.branchesLists = [{ id: 0, name: "Select all" }, ...res.Branch?.content!]) : "";
			res.ClientsList?.content! ? (this.uiState.lists.clientsLists = [{ id: 0, name: "Select all" }, ...res.ClientsList?.content!]) : "";
			res.GroupsList?.content! ? (this.uiState.lists.groupsLists = [{ id: 0, name: "Select all" }, ...res.GroupsList?.content!]) : "";

			this.initSelectAllChecks();

			let sub2 = this.permissions$.subscribe((res: string[]) => {
				if (!res.includes(this.uiState.privileges.ViewAllBranchs)) {
					this.f.branch?.disable();
					this.f.branch?.patchValue(this.auth.getUser().Branch!);
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
		this.reportDate(todayDate);
		this.minDate(todayDate);
		this.maxDate(todayDate);
	}

	initFilterForm() {
		this.filterForm = new FormGroup<IPolicyRenewalNoticeReportForm>({
			branch: new FormControl("Select all"),
			clientData: new FormControl(null),
			clientGroup: new FormControl("Select all"),
			insuranceCompany: new FormControl([]),
			classOfBusiness: new FormControl([]),
			lineOfBusiness: new FormControl([]),
			reportType: new FormControl(1, Validators.required),
			reportDate: new FormControl(null, Validators.required),
			minDate: new FormControl(null, Validators.required),
			maxDate: new FormControl(null, Validators.required),
		});
		this.uiState.checkAllControls.allLinesOfBusinessControl.disable();

		let sub = this.f.classOfBusiness?.valueChanges.subscribe((res) => {
			if (res?.length! == 0) {
				this.uiState.checkAllControls.allLinesOfBusinessControl.disable();
				this.uiState.lists.linesOfBusinessLists = [];
			} else this.uiState.checkAllControls.allLinesOfBusinessControl.enable();
		});
		this.subscribes.push(sub!);
	}

	initSelectAllChecks() {
		if (this.uiState.lists.insuranceCompanyControlLists != undefined && this.uiState.lists.insuranceCompanyControlLists.length > 0) {
			this.uiState.checkAllControls.allInsuranceCompanyControl.patchValue(true);
			this.checkAllToggler(true, "insuranceCompany");
		}
		this.uiState.checkAllControls.allClassOfBusinessControl.patchValue(true);
		this.uiState.checkAllControls.allLinesOfBusinessControl.patchValue(true);

		if (this.uiState.lists.classOfBusinessLists != undefined && this.uiState.lists.classOfBusinessLists.length > 0) {
			this.checkAllToggler(true, "classOfBusiness");
			if (this.uiState.lists.linesOfBusinessLists.length > 0)
				this.checkAllToggler(this.uiState.checkAllControls.allLinesOfBusinessControl.value!, "linesOfBusiness");
		}
	}

	setClientData(e: any) {
		let data = `${e.id}, ${e.name}`;
		this.f.clientData?.patchValue(data);
	}

	checkAllToggler(check: boolean, controlName: string) {
		switch (controlName) {
			case "insuranceCompany":
				if (check) this.f.insuranceCompany?.patchValue(this.uiState.lists.insuranceCompanyControlLists.map((e) => e.name));
				else this.f.insuranceCompany?.patchValue([]);
				break;
			case "classOfBusiness":
				if (check) {
					this.f.classOfBusiness?.patchValue(this.uiState.lists.classOfBusinessLists.map((e) => e.name));
					this.getLinesOfBusiness(this.f.classOfBusiness?.getRawValue()!);
				} else {
					this.f.classOfBusiness?.patchValue([]);
					this.f.lineOfBusiness?.patchValue([]);
					this.uiState.checkAllControls.allLinesOfBusinessControl.patchValue(false);
					this.uiState.lists.linesOfBusinessLists = [];
					this.uiState.initLineOfBusinessFlag = false;
				}
				break;
			case "linesOfBusiness":
				if (check) this.f.lineOfBusiness?.patchValue(this.uiState.lists.linesOfBusinessLists.map((e) => e));
				else this.f.lineOfBusiness?.patchValue([]);
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
			case "classOfBusiness":
				this.f.classOfBusiness?.value?.length! < this.uiState.lists.classOfBusinessLists.length
					? this.uiState.checkAllControls.allClassOfBusinessControl.patchValue(false)
					: this.f.classOfBusiness?.value?.length! == this.uiState.lists.classOfBusinessLists.length
					? this.uiState.checkAllControls.allClassOfBusinessControl.patchValue(true)
					: "";
				break;
			case "linesOfBusiness":
				this.f.lineOfBusiness?.value?.length! < this.uiState.lists.linesOfBusinessLists.length
					? this.uiState.checkAllControls.allLinesOfBusinessControl.patchValue(false)
					: this.f.lineOfBusiness?.value?.length! == this.uiState.lists.linesOfBusinessLists.length
					? this.uiState.checkAllControls.allLinesOfBusinessControl.patchValue(true)
					: "";
				break;
			default:
				return;
		}
	}

	getLinesOfBusiness(classList: any) {
		if (
			(!this.uiState.initLineOfBusinessFlag && this.uiState.lists.linesOfBusinessLists.length == 0) ||
			this.uiState.lists.classOfBusinessLists.length > this.f.classOfBusiness?.value?.length! ||
			(!this.uiState.initLineOfBusinessFlag &&
				this.uiState.checkAllControls.allClassOfBusinessControl.value &&
				this.f.classOfBusiness?.value?.length! > 0)
		) {
			let cls = classList.map((el: any) => (el?.name ? el?.name : el));
			let sub = this.productionService.getLinesOFBusinessByClassNames(cls).subscribe((res: HttpResponse<IBaseResponse<string[]>>) => {
				this.uiState.lists.linesOfBusinessLists = res.body?.data!;
				this.checkAllToggler(this.uiState.checkAllControls.allLinesOfBusinessControl.value!, "linesOfBusiness");
			});
			this.subscribes.push(sub);
			this.uiState.initLineOfBusinessFlag = true;
		}
	}

	reportDate(e: any) {
		this.f.reportDate?.patchValue(e.gon);
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

	onSubmit(filterForm: FormGroup<IPolicyRenewalNoticeReportForm>) {
		this.submitted = true;
		if (this.filterForm?.invalid) {
			return;
		}
		// Display Submitting Loader
		this.eventService.broadcast(reserved.isLoading, true);
		const data: IPolicyRenewalNoticeReportReq = {
			...filterForm.getRawValue(),
			branch: filterForm.getRawValue().branch === "Select all" ? null : filterForm.getRawValue().branch,
			clientData: this.uiState.clientDataContorl.getRawValue() === "Select all" ? null : filterForm.getRawValue().clientData,
			clientGroup: filterForm.getRawValue().clientGroup === "Select all" ? null : filterForm.getRawValue().clientGroup,
			reportDate: this.utils.dateFormater(filterForm.getRawValue().reportDate) as any,
			minDate: this.utils.dateFormater(filterForm.getRawValue().minDate) as any,
			maxDate: this.utils.dateFormater(filterForm.getRawValue().maxDate) as any,
		};

		let sub = this.productionService.viewRenewalNoticeReport(data).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
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
		this.utils.reportViewer(data!, "ٌRenewals Notice Reports");
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}

	resetForm() {
		this.filterForm.reset();
		this.f.insuranceCompany?.patchValue([]);
		this.f.classOfBusiness?.patchValue([]);
		this.f.lineOfBusiness?.patchValue([]);
		this.f.branch?.patchValue("Select all");
		this.f.clientGroup?.patchValue("Select all");
		this.f.reportType?.patchValue(1);

		this.submitted = false;
	}
}
