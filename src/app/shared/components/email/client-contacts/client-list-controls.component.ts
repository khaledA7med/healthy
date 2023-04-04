import { Component, ElementRef, ViewChild } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";
import { EmailModalComponent } from "../email-modal/email-modal.component";

@Component({
	selector: "app-email-contact-list-controls",
	template: `
		<div class="col">
			<div ngbDropdown class="d-inline-block">
				<button type="button" class="btn btn-ghost-secondary waves-effect rounded-pill" id="actionDropdown" ngbDropdownToggle>
					<i class="ri-more-2-fill"></i>
				</button>
				<div ngbDropdownMenu aria-labelledby="actionDropdown">
					<button ngbDropdownItem (click)="toFunc()" class="btn btn-sm" #to>To</button>
					<button ngbDropdownItem (click)="ccFunc()" class="btn btn-sm" #cc>CC</button>
					<button ngbDropdownItem (click)="bccFunc()" class="btn btn-sm" #bcc>BCC</button>
				</div>
			</div>
		</div>
	`,
	styles: ["#actionDropdown::after {display: none}"],
})
export class EmailContactListControlsComponent {
	public params!: ICellRendererParams;
	public comp!: EmailModalComponent;
	private email!: string;

	@ViewChild("to") to!: ElementRef;
	@ViewChild("cc") cc!: ElementRef;
	@ViewChild("bcc") bcc!: ElementRef;

	constructor() {}

	agInit(params: ICellRendererParams) {
		this.params = params;
		this.comp = this.params.context.comp;
		this.email = this.params.data?.email || this.params.data?.contactEmail;
	}

	toFunc() {
		console.log(this.email);
		this.comp.patchToList(this.email);
		if (!this.comp.uiState.toList.includes(this.email)) this.to.nativeElement.classList.remove("bg-soft-dark");
		else this.to.nativeElement.classList.add("bg-soft-dark");
	}

	ccFunc() {
		this.comp.patchCCList(this.email);
		if (!this.comp.uiState.ccList.includes(this.email)) this.cc.nativeElement.classList.remove("bg-soft-dark");
		else this.cc.nativeElement.classList.add("bg-soft-dark");
	}

	bccFunc() {
		this.comp.patchBCCList(this.email);
		if (!this.comp.uiState.bccList.includes(this.email)) this.bcc.nativeElement.classList.remove("bg-soft-dark");
		else this.bcc.nativeElement.classList.add("bg-soft-dark");
	}
}
