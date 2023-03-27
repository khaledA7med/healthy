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
		toList: [],
		ccList: [],
		bccList: [],
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

	mailFormGroup!: FormGroup<any>;

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

	patchToList(e: any) {
		console.log(e);
	}

	//#region Mail form
	initMailForm() {
		this.mailFormGroup = new FormGroup({
			to: new FormControl([]),
			cc: new FormControl([]),
			bcc: new FormControl([]),
			subject: new FormControl(null),
			body: new FormControl(null),
			document: new FormControl(null),
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
