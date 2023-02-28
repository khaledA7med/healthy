import { HttpResponse } from "@angular/common/http";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IClientReportFilters } from "src/app/shared/app/models/Clients/iclient-reoprt-filters";
import { ClientsService } from "src/app/shared/services/clients/clients.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ReportsViewerComponent } from "../../reports-viewer/reports-viewer.component";

@Component({
	selector: "app-client-reports",
	templateUrl: "./client-reports.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./client-reports.component.scss"],
})
export class ClientReportsComponent implements OnInit {
	closeResult!: string;
	url!: any;

	filterForms!: FormGroup<IClientReportFilters>;
	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState: any;
	modalRef!: NgbModalRef;
	constructor(
		private modalService: NgbModal,
		private ClientsService: ClientsService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.Client);
	}

	initFilterForm(): void {
		this.filterForms = new FormGroup<IClientReportFilters>({
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

	resetForm(): void {
		this.filterForms.reset();
		this.submitted = false;
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

	onSubmit(filterForm: FormGroup<IClientReportFilters>) {
		this.submitted = true;

		// Display Submitting Loader
		this.eventService.broadcast(reserved.isLoading, true);

		let sub = this.ClientsService.viewReport(filterForm.value).subscribe(
			(res: HttpResponse<IBaseResponse<any>>) => {
				if (res.body?.status) {
					this.eventService.broadcast(reserved.isLoading, false);
					if (this.filterForms?.invalid) {
						// this.message.popup("error!..", "Enter required data");
						return;
					} else {
						this.eventService.broadcast(reserved.isLoading, false);
						this.message.toast(res.body.message!, "success");
						this.openReportsViewer(res.body.data);
					}
				} else this.message.popup("Sorry!", res.body?.message!, "warning");
				// Hide Loader
				this.eventService.broadcast(reserved.isLoading, false);
			},
			(err) => this.message.popup("Sorry!", err.message!, "error")
		);
		this.subscribes.push(sub);
	}

	openReportsViewer(data?: string): void {
		this.modalRef = this.modalService.open(ReportsViewerComponent, { fullscreen: true });
		this.modalRef.componentInstance.data = {
			reportName: "Clients Reports",
			// url:
			// 	"https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d55232.657228351054!2d31.319837900000003!3d30.093009899999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg!4v1677497557644!5m2!1sen!2seg" ||
			// 	data,
			url: data,
		};

		let sub = this.modalRef.closed.subscribe((res) => {
			console.log(res);
		});
		this.subscribes.push(sub);
	}
}
