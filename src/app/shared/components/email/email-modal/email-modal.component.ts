import { IEmailResponse } from "src/app/shared/app/models/Email/email-response";
import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";

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
	};
	editorData = ClassicEditor;
	subject = [{ name: "hight" }, { name: "medium" }, { name: "low" }];

	mailFormGroup!: FormGroup<IEmailResponse>;

	documentsToUpload: File[] = [];
	docs: any[] = [];

	@Input() buttons: boolean = false;
	@Input() modalData!: IEmailResponse;

	@ViewChild("emailContent") emailContent!: ElementRef;

	constructor(private modalService: NgbModal) {}

	ngOnInit(): void {
		this.initMailForm();
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
			MailToList: new FormControl([]),
			EmailCC: new FormControl([]),
			EmailBCC: new FormControl([]),
			Subject: new FormControl(null),
			Body: new FormControl(null),
			Attachments: new FormControl(null),
			Priority: new FormControl(""),
		});
	}
	get f() {
		return this.mailFormGroup.controls;
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (this.modalData) this.patchValues(this.modalData);
	}

	patchValues(data: IEmailResponse) {}

	getEditorData({ editor }: ChangeEvent) {
		console.log(editor.getData());
	}

	documentsList(evt: File[]) {
		this.documentsToUpload = evt;
	}
	//#endregion

	ngOnDestroy(): void {
		console.log("Destroied");
	}
}
