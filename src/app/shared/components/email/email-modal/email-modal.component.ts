import { IEmailResponse } from "src/app/shared/app/models/Email/email-response";
import { FormControl, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import { EventService } from "src/app/core/services/event.service";
import { EmailService } from "src/app/shared/services/emails/email.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IGenericResponseType } from "src/app/core/models/masterTableModels";
import { Subscription } from "rxjs";
import { reserved } from "src/app/core/models/reservedWord";

@Component({
	selector: "app-email-modal",
	templateUrl: "./email-modal.component.html",
	styleUrls: ["./email-modal.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class EmailModalComponent implements OnInit, OnChanges, OnDestroy {
	emailModalInstance = this;
	uiState = {
		toList: [] as string[],
		ccList: [] as string[],
		bccList: [] as string[],
		isCc: true,
		isBcc: true,
		modalBody: {
			email: true,
			clientContact: false,
			insuranceCompanyContact: false,
		},
		priorityList: [] as IGenericResponseType[],
		submitted: false,
	};
	editorData = ClassicEditor;
	mailbody!: string;

	mailFormGroup!: FormGroup<IEmailResponse>;

	documentsToUpload: File[] = [];
	docs: any[] = [];
	subscribes: Subscription[] = [];

	@Input() buttons: boolean = false;
	@Input() modalData!: IEmailResponse;

	@ViewChild("emailContent") emailContent!: ElementRef;

	constructor(
		private modalService: NgbModal,
		private eventService: EventService,
		private emailService: EmailService,
		private message: MessagesService
	) {}

	ngOnInit(): void {
		this.initMailForm();
		let sub = this.emailService.getEmailsPriorityList().subscribe((res) => {
			this.uiState.priorityList = res.data?.content!;
		});
		this.subscribes.push(sub);
	}

	openModal() {
		this.modalService.open(this.emailContent, {
			size: "lg",
			centered: true,
			backdrop: "static",
			keyboard: false,
			scrollable: true,
			animation: true,
		});
	}

	toggleCc() {
		this.uiState.isCc = !this.uiState.isCc;
	}

	toggleBcc() {
		this.uiState.isBcc = !this.uiState.isBcc;
	}

	patchToList(e: string) {
		if (this.uiState.toList.includes(e)) {
			this.uiState.toList = this.uiState.toList.filter((item: string) => item !== e);
		} else this.uiState.toList.push(e);
		this.f.MailToList?.patchValue(this.uiState.toList);
	}

	patchCCList(e: string) {
		if (this.uiState.ccList.includes(e)) {
			this.uiState.ccList = this.uiState.ccList.filter((item: string) => item !== e);
		} else this.uiState.ccList.push(e);
		this.f.EmailCC?.patchValue(this.uiState.ccList);
	}

	patchBCCList(e: string) {
		if (this.uiState.bccList.includes(e)) {
			this.uiState.bccList = this.uiState.bccList.filter((item: string) => item !== e);
		} else this.uiState.bccList.push(e);
		this.f.EmailBCC?.patchValue(this.uiState.bccList);
	}

	//#region Mail form
	initMailForm() {
		this.mailFormGroup = new FormGroup<IEmailResponse>({
			MailToList: new FormControl([], Validators.required),
			EmailCC: new FormControl([]),
			EmailBCC: new FormControl([]),
			Subject: new FormControl(null, Validators.required),
			Body: new FormControl(null, Validators.required),
			Attachments: new FormControl(null),
			Priority: new FormControl("Low"),
		});
	}
	get f() {
		return this.mailFormGroup.controls;
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (this.modalData) this.patchValues(this.modalData);
	}

	patchValues(data: IEmailResponse) {
		console.log(this.modalData);
	}

	getEditorData({ editor }: ChangeEvent) {
		// const data = editor.getData();
		this.mailbody = editor.getData();
	}

	documentsList(evt: File[]) {
		this.documentsToUpload = evt;
	}

	sendEmail() {
		if (this.mailFormGroup.invalid) return;
		else {
			this.eventService.broadcast(reserved.isLoading, true);
			this.f.Body?.patchValue(this.mailbody || "");
			console.log(this.mailFormGroup.getRawValue());
			this.uiState.submitted = true;
			const formData = new FormData();
			// this.f.MailToList?.value?.forEach((item, i) => formData.append(`MailToList[${i}]`, item));
			this.f.MailToList?.value?.forEach((item, i) => formData.append(`MailToList`, item));

			// this.f.EmailCC?.value?.forEach((item, i) => formData.append(`EmailCC[${i}]`, item));
			this.f.EmailCC?.value?.forEach((item, i) => formData.append(`EmailCC`, item));

			// this.f.EmailBCC?.value?.forEach((item, i) => formData.append(`EmailBCC[${i}]`, item));
			this.f.EmailBCC?.value?.forEach((item, i) => formData.append(`EmailBCC`, item));

			formData.append("Subject", this.f.Subject?.value!);
			formData.append("Body", this.f.Body?.value!);
			this.documentsToUpload.forEach((el) => formData.append("Attachments", el));
			formData.append("Priority", this.f.Priority?.value!);
			let sub = this.emailService.sendEmail(formData).subscribe((res) => {
				if (res.status) this.message.toast(res.message!, "success");
				else this.message.popup("Sorry!", res.message!, "warning");
				this.eventService.broadcast(reserved.isLoading, false);
			});
			this.subscribes.push(sub);
		}
	}
	//#endregion

	ngOnDestroy(): void {
		console.log("Destroied");
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
