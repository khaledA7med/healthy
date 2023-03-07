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
import { ReportsViewerComponent } from "src/app/shared/components/reports-viewer/reports-viewer.component";
import { ProductionService } from "src/app/shared/services/production/production.service";
import { productionReportForm } from "src/app/shared/app/models/Production/iproduction-report";
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
			allTransactionTypesControl: new FormControl(false),
			allProducersControl: new FormControl(false),
		},
		lists: {
			branchesLists: [] as IGenericResponseType[],
			insuranceCompanyControlLists: [] as IGenericResponseType[],
			classOfBusinessLists: [] as IGenericResponseType[],
			linesOfBusinessLists: [] as string[],
			transactionTypesLists: [] as IGenericResponseType[],
			producersLists: [] as IGenericResponseType[],
			clientsList: [] as IGenericResponseType[],
			groupsLists: [] as IGenericResponseType[],
		},
		clientDataContorl: new FormControl("Select All"),
	};
	modalRef!: NgbModalRef;
	constructor(
		private modalService: NgbModal,
		private productionService: ProductionService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private utils: AppUtils
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.Reports);

		let sub = this.lookupData.subscribe((res) => {
			this.uiState.lists.branchesLists = res.Branch?.content!;
			this.uiState.lists.insuranceCompanyControlLists = res.InsuranceCompanies?.content!;
			this.uiState.lists.classOfBusinessLists = res.InsurClasses?.content!;
			this.uiState.lists.transactionTypesLists = res.PolicyEndorsTypes?.content!;
			this.uiState.lists.producersLists = res.Producers?.content!;
			res.ClientsList?.content! ? (this.uiState.lists.clientsList = [{ id: 0, name: "Select All" }, ...res.ClientsList?.content!]) : "";
			res.GroupsList?.content! ? (this.uiState.lists.groupsLists = [{ id: 0, name: "Select All" }, ...res.GroupsList?.content!]) : "";
		});
		this.subscribes.push(sub);
	}

	initFilterForm() {
		this.filterForm = new FormGroup<productionReportForm>({
			branchs: new FormControl(null),
			clientData: new FormControl(null),
			clientGroup: new FormControl("Select All"),
			transactionType: new FormControl(null),
			producers: new FormControl(null),
			insuranceCompany: new FormControl(null),
			classOfBusiness: new FormControl(null),
			lineOfBusiness: new FormControl(null),
			reportType: new FormControl(1),
			basedOn: new FormControl(1),
			status: new FormControl(1),
			captive_NonPactive: new FormControl(1),
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
				else this.f.branchs?.patchValue(null);
				break;
			case "insuranceCompany":
				if (check) this.f.insuranceCompany?.patchValue(this.uiState.lists.insuranceCompanyControlLists.map((e) => e.name));
				else this.f.insuranceCompany?.patchValue(null);
				break;
			case "classOfBusiness":
				if (check) {
					this.f.classOfBusiness?.patchValue(this.uiState.lists.classOfBusinessLists.map((e) => e.name));
					this.getLinesOfBusiness(this.f.classOfBusiness?.getRawValue()!);
				} else this.f.classOfBusiness?.patchValue(null);
				break;
			case "linesOfBusiness":
				if (check) this.f.lineOfBusiness?.patchValue(this.uiState.lists.linesOfBusinessLists.map((e) => e));
				else this.f.lineOfBusiness?.patchValue(null);
				break;
			case "transactionTypes":
				if (check) this.f.transactionType?.patchValue(this.uiState.lists.transactionTypesLists.map((e) => e.name));
				else this.f.transactionType?.patchValue(null);
				break;
			case "producers":
				if (check) this.f.producers?.patchValue(this.uiState.lists.producersLists.map((e) => e.name));
				else this.f.producers?.patchValue(null);
				break;
			default:
				break;
		}
	}

	getLinesOfBusiness(classList: any) {
		let cls = classList.map((el: any) => (el?.name ? el?.name : el));
		let sub = this.productionService.getLinesOFBusinessByClassNames(cls).subscribe((res: HttpResponse<IBaseResponse<string[]>>) => {
			this.uiState.lists.linesOfBusinessLists = res.body?.data!;
		});
		this.subscribes.push(sub);
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

	onSubmit(filterForm: FormGroup<productionReportForm>) {
		this.submitted = true;
		if (this.filterForm?.invalid) {
			return;
		}
		// Display Submitting Loader
		this.eventService.broadcast(reserved.isLoading, true);
		const data: any = {
			...filterForm.getRawValue(),
			clientData: this.uiState.clientDataContorl.getRawValue() === "Select All" ? null : "",
			clientGroup: this.filterForm.getRawValue().clientGroup === "Select All" ? null : "",
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
			reportName: "Production(statistics) Report",
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
