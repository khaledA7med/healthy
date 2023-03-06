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
import { ReportsViewerComponent } from "../../reports-viewer/reports-viewer.component";

import {
	IBusinessDevelopmentProspectsReportForm,
	IBusinessDevelopmentProspectsReportReq,
} from "src/app/shared/app/models/BusinessDevelopment/ibusiness-development-prospects-report";

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
		private utils: AppUtils
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.BusinessDevelopment);

		let sub = this.lookupData.subscribe((res) => {
			this.uiState.lists.branchesLists = res.Branch?.content!;
			this.uiState.lists.producersLists = res.Producers?.content!;
			this.uiState.lists.classOfBusinessLists = res.InsurClasses?.content!;
		});
		this.subscribes.push(sub);
	}

	initFilterForm() {
		this.filterForm = new FormGroup<IBusinessDevelopmentProspectsReportForm>({
			branchs: new FormControl(null),
			producers: new FormControl(null),
			classofBusiness: new FormControl(null),
			reportType: new FormControl(null, Validators.required),
			minDate: new FormControl(null, Validators.required),
			maxDate: new FormControl(null, Validators.required),
		});
	}

	checkAllToggler(check: boolean, controlName: string) {
		if (controlName === "branch") {
			if (check) this.f.branchs?.patchValue(this.uiState.lists.branchesLists.map((e) => e.name));
			else this.f.branchs?.patchValue(null);
		} else if (controlName === "producer") {
			if (check) this.f.producers?.patchValue(this.uiState.lists.producersLists.map((e) => e.name));
			else this.f.producers?.patchValue(null);
		} else if (controlName === "classOfBusiness") {
			if (check) this.f.classofBusiness?.patchValue(this.uiState.lists.classOfBusinessLists.map((e) => e.name));
			else this.f.classofBusiness?.patchValue(null);
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

		let sub = this.BusinessDevelopmentService.viewProspectsReport(data).subscribe(
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
			reportName: "Prospects Reports",
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