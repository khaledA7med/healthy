import { HttpResponse } from "@angular/common/http";
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation, EventEmitter, Output, OnChanges } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IClientContact } from "src/app/shared/app/models/Clients/iclientContactForm";
import { EmailService } from "src/app/shared/services/emails/email.service";
import { MessagesService } from "src/app/shared/services/messages.service";

@Component({
	selector: "app-add-client-form",
	templateUrl: "./add-client-form.component.html",
	styleUrls: ["./add-client-form.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class AddClientFormComponent implements OnInit, OnDestroy, OnChanges {
	@Input() clientID!: number;
	@Output() contactAdded: EventEmitter<any> = new EventEmitter();

	clientContactFormGroup!: FormGroup<IClientContact>;
	lookupData!: Observable<IBaseMasterTable>;
	subscribes: Subscription[] = [];

	uiState = {
		gridReady: false,
		submitted: false,
	};

	constructor(
		private table: MasterTableService,
		private eventService: EventService,
		private emailService: EmailService,
		private message: MessagesService
	) {}
	ngOnChanges(): void {
		this.clientContactFormGroup ? this.f.clientID?.patchValue(+this.clientID) : "";
		console.log(this.clientID);
	}
	ngOnInit(): void {
		this.getLookupData();
		this.initClientForm();
	}

	getLookupData() {
		this.lookupData = this.table.getBaseData(MODULES.Emails);
	}

	//#region CLient Contacts form
	initClientForm() {
		this.clientContactFormGroup = new FormGroup<IClientContact>({
			branch: new FormControl(""),
			clientID: new FormControl(0),
			contactName: new FormControl("", Validators.required),
			mobile: new FormControl("", Validators.pattern("[0-9]{9}")),
			lineOfBusiness: new FormControl(""),
			department: new FormControl(""),
			position: new FormControl(""),
			tele: new FormControl("", Validators.pattern("[0-9]{9}")),
			email: new FormControl("", Validators.required),
		});
	}
	get f() {
		return this.clientContactFormGroup.controls;
	}

	validationChecker(): boolean {
		if (this.clientContactFormGroup.invalid) return false;
		return true;
	}

	submitClientContact() {
		this.uiState.submitted = true;
		console.log(this.clientContactFormGroup);
		if (!this.validationChecker()) return;
		this.eventService.broadcast(reserved.isLoading, true);

		let sub = this.emailService.saveClientContacts(this.clientContactFormGroup.getRawValue()).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
			if (res.body?.status) {
				this.message.toast(res.body.message!, "success");
				this.resetForm();
				// Output to Collapse
				this.contactAdded.emit(true);
			} else this.message.popup("Sorry!", res.body?.message!, "warning");
			// Hide Loader
			this.eventService.broadcast(reserved.isLoading, false);
		});
		this.subscribes.push(sub);
	}

	resetForm() {
		this.f.contactName?.reset();
		this.f.email?.reset();
		this.f.tele?.reset();
		this.f.mobile?.reset();
		this.f.position?.reset();
		this.f.lineOfBusiness?.reset();
		this.f.branch?.reset();
		this.f.department?.reset();
	}

	//#endregion

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
