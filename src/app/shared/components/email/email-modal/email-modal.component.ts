import { IEmailResponse } from "src/app/shared/app/models/Email/email-response";
import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";

@Component({
	selector: "app-email-modal",
	templateUrl: "./email-modal.component.html",
	styleUrls: ["./email-modal.component.scss"],
})
export class EmailModalComponent implements OnInit, OnChanges {
	uiState = {
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

	formGroup!: FormGroup;
	documentsToUpload: File[] = [];
	docs: any[] = [];

	@Input() buttons: boolean = false;
	@Input() modalData!: IEmailResponse;
	@ViewChild("emailContent") emailContent!: ElementRef;
	constructor(private modalService: NgbModal) {}

	ngOnInit(): void {
		this.initForm();
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

	//#region form
	initForm() {
		this.formGroup = new FormGroup({
			to: new FormControl(null),
			cc: new FormControl(null),
			bcc: new FormControl(null),
			subject: new FormControl(null),
			body: new FormControl(null),
			document: new FormControl(null),
		});
	}
	get f() {
		return this.formGroup.controls;
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
}
