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
	};
	modalRef!: NgbModalRef;
	constructor(
		private modalService: NgbModal,
		private BusinessDevelopmentService: BusinessDevelopmentService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private utils: AppUtils,
		private router: Router
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.BusinessDevelopment);

		let sub = this.lookupData.subscribe((res) => {
			this.uiState.lists.branchesLists = res.Branch?.content!;
			this.uiState.lists.producersLists = res.Producers?.content!;
			this.uiState.lists.classOfBusinessLists = res.InsurClasses?.content!;
		});

		let sub2 = this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				this.modalService.hasOpenModals() ? this.modalRef.close() : "";
			}
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
		this.modalRef = this.modalService.open(ReportsViewerComponent, { fullscreen: true, scrollable: true });
		this.modalRef.componentInstance.data = {
			reportName: "Prospects Reports",
			url: data,
		};
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
