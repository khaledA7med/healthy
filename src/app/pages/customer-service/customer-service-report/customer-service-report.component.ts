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
import { csReportForm, csReportReq } from "src/app/shared/app/models/CustomerService/icustomer-service-report";
import { CustomerServiceService } from "src/app/shared/services/customer-service/customer-service.service";

@Component({
	selector: "app-customer-service-report",
	templateUrl: "./customer-service-report.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./customer-service-report.component.scss"],
})
export class CustomerServiceReportComponent implements OnInit, OnDestroy {
	url!: any;
	filterForm!: FormGroup<csReportForm>;
	checkAllStatus: FormControl<boolean | null> = new FormControl(false);
	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		checkAllControls: {
			allStatusControl: new FormControl(false),
			allInsuranceCompanyControl: new FormControl(false),
			allClassOfBusinessControl: new FormControl(false),
		},
		lists: {
			usersLists: [] as IGenericResponseType[],
			clientsLists: [] as IGenericResponseType[],
			branchesLists: [] as IGenericResponseType[],
			insuranceCompanyControlLists: [] as IGenericResponseType[],
			classOfBusinessLists: [] as IGenericResponseType[],
			linesOfBusinessLists: [] as string[],
			transactionTypesLists: [] as IGenericResponseType[],
			producersLists: [] as IGenericResponseType[],
			statusList: [] as IGenericResponseType[],
		},
		clientDataContorl: new FormControl("Select All"),
	};
	modalRef!: NgbModalRef;
	constructor(
		private modalService: NgbModal,
		private csService: CustomerServiceService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private utils: AppUtils
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.Reports);

		let sub = this.lookupData.subscribe((res) => {
			res.ClientsList?.content! ? (this.uiState.lists.clientsLists = [{ id: 0, name: "Select All" }, ...res.ClientsList?.content!]) : "";
			res.AllUsers?.content! ? (this.uiState.lists.usersLists = [{ id: 0, name: "Select All" }, ...res.AllUsers?.content!]) : "";
			res.Branch?.content! ? (this.uiState.lists.branchesLists = [{ id: 0, name: "Select All" }, ...res.Branch?.content!]) : "";

			this.uiState.lists.insuranceCompanyControlLists = res.InsuranceCompanies?.content!;
			this.uiState.lists.classOfBusinessLists = res.InsurClasses?.content!;
			this.uiState.lists.transactionTypesLists = res.PolicyEndorsTypes?.content!;
			this.uiState.lists.producersLists = res.Producers?.content!;
			this.uiState.lists.statusList = res.CServiceStatus?.content!;
		});
		this.subscribes.push(sub);
	}

	initFilterForm() {
		this.filterForm = new FormGroup<csReportForm>({
			branch: new FormControl("Select All"),
			user: new FormControl("Select All"),
			classOfBusiness: new FormControl(null),
			insuranceCompany: new FormControl(null),
			clientData: new FormControl(null),
			status: new FormControl(null),
			reportType: new FormControl(null),
			currentStatus: new FormControl(null),
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
			case "insuranceCompany":
				if (check) this.f.insuranceCompany?.patchValue(this.uiState.lists.insuranceCompanyControlLists.map((e) => e.name));
				else this.f.insuranceCompany?.patchValue(null);
				break;
			case "classOfBusiness":
				if (check) this.f.classOfBusiness?.patchValue(this.uiState.lists.classOfBusinessLists.map((e) => e.name));
				else this.f.classOfBusiness?.patchValue(null);
				break;
			case "status":
				if (check) this.f.status?.patchValue(this.uiState.lists.statusList.map((e) => e.name));
				else this.f.status?.patchValue(null);
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

	onSubmit(filterForm: FormGroup<csReportForm>) {
		this.submitted = true;
		if (this.filterForm?.invalid) {
			return;
		}
		// Display Submitting Loader
		this.eventService.broadcast(reserved.isLoading, true);
		const data: csReportReq = {
			...filterForm.getRawValue(),
			clientData: this.uiState.clientDataContorl.getRawValue() === "Select All" ? null : filterForm.getRawValue().clientData,
			user: this.filterForm.getRawValue().user === "Select All" ? null : filterForm.getRawValue().user,
			branch: this.filterForm.getRawValue().branch === "Select All" ? null : filterForm.getRawValue().branch,
			minDate: this.utils.dateFormater(filterForm.getRawValue().minDate) as any,
			maxDate: this.utils.dateFormater(filterForm.getRawValue().maxDate) as any,
		};

		let sub = this.csService.viewCSReport(data).subscribe(
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
