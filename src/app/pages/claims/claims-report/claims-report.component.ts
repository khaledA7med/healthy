import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
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
import { claimsReportForm, claimsReportReq } from "src/app/shared/app/models/Claims/iclaims-report";
import { ClaimsService } from "src/app/shared/services/claims/claims.service";

@Component({
	selector: "app-claims-report",
	templateUrl: "./claims-report.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./claims-report.component.scss"],
})
export class ClaimsReportComponent implements OnInit, OnDestroy {
	url!: any;
	filterForm!: FormGroup<claimsReportForm>;
	checkAllStatus: FormControl<boolean | null> = new FormControl(false);
	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		checkAllControls: {
			allStatusControl: new FormControl(false),
			allSubStatusControl: new FormControl(false),
			allInsuranceCompanyControl: new FormControl(false),
			allClassOfBusinessControl: new FormControl(false),
			allLineOfBusinessControl: new FormControl(false),
		},
		lists: {
			groupsList: [] as IGenericResponseType[],
			clientsLists: [] as IGenericResponseType[],
			branchesLists: [] as IGenericResponseType[],
			insuranceCompanyControlLists: [] as IGenericResponseType[],
			classOfBusinessLists: [] as IGenericResponseType[],
			linesOfBusinessLists: [] as string[],
			statusList: [] as IGenericResponseType[],
			subStatusList: [] as string[],
		},
		subStatus: [],
		clientDataContorl: new FormControl("Select All"),
	};
	modalRef!: NgbModalRef;
	constructor(
		private modalService: NgbModal,
		private claimService: ClaimsService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private utils: AppUtils
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.Reports);

		let sub = this.lookupData.subscribe((res) => {
			res.Branch?.content! ? (this.uiState.lists.branchesLists = [{ id: 0, name: "Select All" }, ...res.Branch?.content!]) : "";
			res.ClientsList?.content! ? (this.uiState.lists.clientsLists = [{ id: 0, name: "Select All" }, ...res.ClientsList?.content!]) : "";
			res.GroupsList?.content! ? (this.uiState.lists.groupsList = [{ id: 0, name: "Select All" }, ...res.GroupsList?.content!]) : "";

			this.uiState.lists.insuranceCompanyControlLists = res.InsuranceCompanies?.content!;
			this.uiState.lists.classOfBusinessLists = res.InsurClasses?.content!;
			this.uiState.lists.statusList = res.ClaimStatus?.content!;
		});
		this.subscribes.push(sub);
	}

	initFilterForm() {
		this.filterForm = new FormGroup<claimsReportForm>({
			branch: new FormControl("Select All"),
			clientData: new FormControl(null),
			clientGroup: new FormControl("Select All"),
			status: new FormControl(null),
			subStatus: new FormControl(null),
			rejectionReason: new FormControl(null),
			insuranceCompany: new FormControl(null),
			classOfBusiness: new FormControl(null),
			lineOfBusiness: new FormControl(null),
			reportType: new FormControl(null),
			excludeZeroClaimAmount: new FormControl(null),
			minDate: new FormControl(null, Validators.required),
			maxDate: new FormControl(null, Validators.required),
		});
	}

	setClientData(e: any) {
		let data = `${e.id}, ${e.name}`;
		this.f.clientData?.patchValue(data);
	}

	getSubStatus() {
		if (this.f.status?.value!.length == 0) {
			this.uiState.subStatus = [];
			this.f.subStatus?.reset();
			return;
		}
		let sub = this.claimService.getSubStatus(this.f.status?.value!).subscribe(
			(res: HttpResponse<IBaseResponse<string[]>>) => {
				this.uiState.lists.subStatusList = res.body?.data!;
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
			}
		);
		this.subscribes.push(sub);
	}

	getLinesOfBusiness(classList: any) {
		let cls = classList.map((el: any) => (el?.name ? el?.name : el));
		let sub = this.claimService.getLinesOFBusinessByClassNames(cls).subscribe((res: HttpResponse<IBaseResponse<string[]>>) => {
			this.uiState.lists.linesOfBusinessLists = res.body?.data!;
		});
		this.subscribes.push(sub);
	}

	checkAllToggler(check: boolean, controlName: string) {
		switch (controlName) {
			case "insuranceCompany":
				if (check) this.f.insuranceCompany?.patchValue(this.uiState.lists.insuranceCompanyControlLists.map((e) => e.name));
				else this.f.insuranceCompany?.patchValue(null);
				break;
			case "classOfBusiness":
				if (check) {
					this.f.classOfBusiness?.patchValue(this.uiState.lists.classOfBusinessLists.map((e) => e.name));
					this.getLinesOfBusiness(this.f.classOfBusiness?.getRawValue());
				} else {
					this.f.classOfBusiness?.patchValue(null);
					this.f.lineOfBusiness?.patchValue(null);
					this.uiState.lists.linesOfBusinessLists = [];
				}
				break;
			case "lineOfBusiness":
				if (check) this.f.lineOfBusiness?.patchValue(this.uiState.lists.linesOfBusinessLists.map((e) => e));
				else this.f.lineOfBusiness?.patchValue(null);
				break;
			case "status":
				if (check) {
					this.f.status?.patchValue(this.uiState.lists.statusList.map((e) => e.name));
					this.getSubStatus();
				} else {
					this.f.status?.patchValue(null);
					this.f.subStatus?.patchValue(null);
					this.uiState.lists.subStatusList = [];
				}
				break;
			case "subStatus":
				if (check) this.f.subStatus?.patchValue(this.uiState.lists.subStatusList.map((e) => e));
				else this.f.subStatus?.patchValue(null);

				break;
			default:
				break;
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

	onSubmit(filterForm: FormGroup<claimsReportForm>) {
		this.submitted = true;
		if (this.filterForm?.invalid) {
			return;
		}
		// Display Submitting Loader
		this.eventService.broadcast(reserved.isLoading, true);
		const data: claimsReportReq = {
			...filterForm.getRawValue(),
			clientData: this.uiState.clientDataContorl.getRawValue() === "Select All" ? null : filterForm.getRawValue().clientData,
			branch: this.filterForm.getRawValue().branch === "Select All" ? null : filterForm.getRawValue().branch,
			minDate: this.utils.dateFormater(filterForm.getRawValue().minDate) as any,
			maxDate: this.utils.dateFormater(filterForm.getRawValue().maxDate) as any,
		};

		let sub = this.claimService.viewCSReport(data).subscribe(
			(res: HttpResponse<IBaseResponse<any>>) => {
				if (res.body?.status) {
					this.eventService.broadcast(reserved.isLoading, false);
					this.message.toast(res.body.message!, "success");
					this.openReportsViewer(res.body.data);
				} else this.message.popup("Sorry!", res.body?.message!, "warning");
				// Hide Loader
				this.eventService.broadcast(reserved.isLoading, false);
			},
			(err) => {
				this.eventService.broadcast(reserved.isLoading, false);
				this.message.popup("Sorry!", err.message!, "error");
			}
		);
		this.subscribes.push(sub);
	}

	openReportsViewer(data?: string): void {
		this.modalRef = this.modalService.open(ReportsViewerComponent, { fullscreen: true, scrollable: true });
		this.modalRef.componentInstance.data = {
			reportName: "CRM Reports",
			url: data,
		};
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}

	resetForm() {
		this.filterForm.reset();
		this.submitted = false;
	}
}
