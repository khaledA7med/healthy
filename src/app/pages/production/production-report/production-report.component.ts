import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { Caching, IBaseMasterTable, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import AppUtils from "src/app/shared/app/util";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ReportsViewerComponent } from "../../reports-viewer/reports-viewer.component";
import { ProductionService } from "src/app/shared/services/production/production.service";
import { productionReportForm } from "src/app/shared/app/models/Production/iproduction-report";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
@Component({
	selector: "app-production-report",
	templateUrl: "./production-report.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./production-report.component.scss"],
})
export class ProductionReportComponent implements OnInit, OnDestroy {
	url!: any;
	filterForm!: FormGroup<productionReportForm>;
	checkAllStatus: FormControl<boolean | null> = new FormControl(false);
	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		checkAllControls: {
			allBranchControl: new FormControl(false),
			allInsuranceCompanyControl: new FormControl(false),
			allClassOfBusinessControl: new FormControl(false),
			allLinesOfBusinessControl: new FormControl(false),
		},
		lists: {
			branchesLists: [] as IGenericResponseType[],
			insuranceCompanyControlLists: [] as IGenericResponseType[],
			classOfBusinessLists: [] as IGenericResponseType[],
			linesOfBusinessLists: [] as IGenericResponseType[],
		},
	};
	modalRef!: NgbModalRef;
	constructor(
		private modalService: NgbModal,
		private productionService: ProductionService,
		private message: MessagesService,
		private table: MasterTableService,
		private methods: MasterMethodsService,
		private eventService: EventService,
		private utils: AppUtils
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.Production);

		let sub = this.lookupData.subscribe((res) => {
			this.uiState.lists.branchesLists = res.Branch?.content!;
			this.uiState.lists.insuranceCompanyControlLists = res.InsuranceCompanies?.content!;
			this.uiState.lists.classOfBusinessLists = res.InsurClasses?.content!;
		});
		this.subscribes.push(sub);
	}

	initFilterForm() {
		this.filterForm = new FormGroup<productionReportForm>({
			branchs: new FormControl(null),
			clientData: new FormControl(null),
			clientGroup: new FormControl(null),
			transactionType: new FormControl(null),
			producers: new FormControl(null),
			insuranceCompany: new FormControl(null),
			classOfBusiness: new FormControl(null),
			lineOfBusiness: new FormControl(null),
			reportType: new FormControl(null),
			basedOn: new FormControl(null),
			status: new FormControl(null),
			captive_NonPactive: new FormControl(null),
			minDate: new FormControl(null, Validators.required),
			maxDate: new FormControl(null, Validators.required),
		});
	}

	checkAllToggler(check: boolean, controlName: string) {
		if (controlName === "branch") {
			if (check) this.f.branchs?.patchValue(this.uiState.lists.branchesLists.map((e) => e.name));
			else this.f.branchs?.patchValue(null);
		} else if (controlName === "insuranceCompany") {
			if (check) this.f.insuranceCompany?.patchValue(this.uiState.lists.insuranceCompanyControlLists.map((e) => e.name));
			else this.f.insuranceCompany?.patchValue(null);
		} else if (controlName === "classOfBusiness") {
			if (check) this.f.classOfBusiness?.patchValue(this.uiState.lists.classOfBusinessLists.map((e) => e.name));
			else this.f.classOfBusiness?.patchValue(null);
		} else if (controlName === "linesOfBusiness") {
			if (check) this.f.lineOfBusiness?.patchValue(this.uiState.lists.linesOfBusinessLists.map((e) => e.name));
			else this.f.lineOfBusiness?.patchValue(null);
		}
	}

	getLinesOfBusiness(classList: IGenericResponseType[]) {
		let cls = classList.map((el) => el.name);
		let sub = this.productionService.getLinesOFBusinessByClassNames(cls).subscribe((res: HttpResponse<IBaseResponse<IGenericResponseType[]>>) => {
			this.uiState.lists.linesOfBusinessLists = res.body?.data!;
		});
		this.subscribes.push(sub);
		console.log(this.uiState.lists.linesOfBusinessLists);
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

	onSubmit(filterForm: FormGroup<any>) {
		this.submitted = true;
		if (this.filterForm?.invalid) {
			return;
		}
		// Display Submitting Loader
		this.eventService.broadcast(reserved.isLoading, true);
		const data: any = {
			...filterForm.getRawValue(),
			minDate: this.utils.dateFormater(filterForm.getRawValue().minDate) as any,
			maxDate: this.utils.dateFormater(filterForm.getRawValue().maxDate) as any,
		};

		let sub = this.productionService.viewProductionReport(data).subscribe(
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
			reportName: "Policies Reports - Renewals",
			url: data,
		};

		// let sub = this.modalRef.closed.subscribe((res) => {
		// 	console.log(res);
		// });
		// this.subscribes.push(sub);
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}

	resetForm() {
		this.filterForm.reset();
		this.submitted = false;
	}
}
