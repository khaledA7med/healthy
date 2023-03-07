import { HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
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

@Component({
	selector: "app-client-reports",
	templateUrl: "./client-reports.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./client-reports.component.scss"],
})
export class ClientReportsComponent implements OnInit, OnDestroy {
	url!: any;
	filterForms!: FormGroup<IClientReportFiltersForm>;
	checkAllStatus: FormControl<boolean | null> = new FormControl(false);
	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		clientStatus: [] as any[],
	};
	modalRef!: NgbModalRef;
	constructor(
		private modalService: NgbModal,
		private ClientsService: ClientsService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private utils: AppUtils
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.Client);

		let sub = this.lookupData.subscribe((res) => {
			this.uiState.clientStatus = res.ClientStatus?.content!;
		});
		this.subscribes.push(sub);
	}

	initFilterForm(): void {
		this.filterForms = new FormGroup<IClientReportFiltersForm>({
			status: new FormControl(["Active"]),
			name: new FormControl(""),
			accountNumber: new FormControl(""),
			crNO: new FormControl(""),
			producer: new FormControl("", Validators.required),
			type: new FormControl(""),
			branchs: new FormControl([]),
			minDate: new FormControl(null, Validators.required),
			maxDate: new FormControl(null, Validators.required),
		});
	}

	checkAllStatusAction(check: boolean | null) {
		if (check) {
			this.f.status?.patchValue(this.uiState.clientStatus.map((e) => e.name));
		} else this.f.status?.patchValue(["Active"]);
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
			minDate: this.utils.dateFormater(filterForm.getRawValue().minDate) as any,
			maxDate: this.utils.dateFormater(filterForm.getRawValue().maxDate) as any,
		};
		// Display Submitting Loader
		this.eventService.broadcast(reserved.isLoading, true);
		let sub = this.ClientsService.viewReport(data).subscribe(
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

	resetForm(): void {
		this.filterForms.reset();
		this.submitted = false;
	}

	openReportsViewer(data?: string): void {
		this.modalRef = this.modalService.open(ReportsViewerComponent, { fullscreen: true, scrollable: true });
		this.modalRef.componentInstance.data = {
			reportName: "Clients Reports",
			url: data,
		};
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
