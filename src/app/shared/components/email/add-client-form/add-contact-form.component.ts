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
import { ICompanyContact } from "src/app/shared/app/models/Email/email-utils";
import { EmailService } from "src/app/shared/services/emails/email.service";
import { MessagesService } from "src/app/shared/services/messages.service";

@Component({
	selector: "app-add-contact-form",
	templateUrl: "./add-contact-form.component.html",
	styleUrls: ["./add-contact-form.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class AddContactFormComponent implements OnInit, OnDestroy, OnChanges {
	@Input() ID!: number;
	@Input() contactType!: string;

	@Output() contactAdded: EventEmitter<any> = new EventEmitter();

	contactFormGroup!: FormGroup<IClientContact>;
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
		this.contactFormGroup ? this.f.clientID?.patchValue(+this.ID) : "";
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
		this.contactFormGroup = new FormGroup<IClientContact>({
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
		return this.contactFormGroup.controls;
	}

	validationChecker(): boolean {
		if (this.contactFormGroup.invalid) return false;
		return true;
	}

	submitClientContact() {
		this.uiState.submitted = true;
		if (!this.validationChecker()) return;
		this.eventService.broadcast(reserved.isLoading, true);
		if (this.contactType === "client") this.saveClientContact();
		else this.saveCompanyContact();
	}

	saveClientContact() {
		let sub = this.emailService.saveClientContacts(this.contactFormGroup.getRawValue()).subscribe((res: IBaseResponse<any>) => {
			if (res.status) {
				this.message.toast(res.message!, "success");
				this.resetForm();
				// Output to Collapse
				this.contactAdded.emit(true);
			} else this.message.popup("Sorry!", res.message!, "warning");
			// Hide Loader
			this.eventService.broadcast(reserved.isLoading, false);
		});
		this.subscribes.push(sub);
	}

	saveCompanyContact() {
		let data: ICompanyContact = {
			companyID: this.ID,
			branch: this.f.branch?.value,
			contactPosition: this.f.position?.value,
			lineOfBusiness: this.f.lineOfBusiness?.value,
			department: this.f.department?.value,
			contactEmail: this.f.email?.value,
			contactName: this.f.contactName?.value,
			contactMobileNo: this.f.mobile?.value,
			contactTele: this.f.tele?.value,
		};
		let sub = this.emailService.saveCompnayContacts(data).subscribe((res: IBaseResponse<any>) => {
			if (res.status) {
				this.message.toast(res.message!, "success");
				this.resetForm();
				// Output to Collapse
				this.contactAdded.emit(true);
			} else this.message.popup("Sorry!", res.message!, "warning");
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
