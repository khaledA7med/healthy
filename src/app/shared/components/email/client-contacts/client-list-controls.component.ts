import { Component, ElementRef, ViewChild } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";
import { EmailModalComponent } from "../email-modal/email-modal.component";
import { ClientContactsComponent } from "./client-contacts.component";

@Component({
	selector: "app-email-contact-list-controls",
	template: `
		<div class="col">
			<div ngbDropdown class="d-inline-block">
				<button type="button" class="btn btn-ghost-secondary waves-effect rounded-pill" id="actionDropdown" ngbDropdownToggle>
					<i class="ri-more-2-fill"></i>
				</button>
				<div ngbDropdownMenu aria-labelledby="actionDropdown">
					<button ngbDropdownItem (click)="toFunc(params.data)" class="btn btn-sm" #to>To</button>
					<button ngbDropdownItem (click)="ccFunc(params.data)" class="btn btn-sm" #cc>CC</button>
					<button ngbDropdownItem (click)="bccFunc(params.data)" class="btn btn-sm" #bcc>BCC</button>
				</div>
			</div>
		</div>
	`,
	styles: ["#actionDropdown::after {display: none}"],
})
export class EmailContactListControlsComponent {
	public params!: ICellRendererParams;
	public comp!: EmailModalComponent;

	@ViewChild("to") to!: ElementRef;
	@ViewChild("cc") cc!: ElementRef;
	@ViewChild("bcc") bcc!: ElementRef;

	constructor() {}

	agInit(params: ICellRendererParams) {
		this.params = params;
		this.comp = this.params.context.comp;
	}

	toFunc(item: any) {
		console.log(this.to.nativeElement);
		this.comp.patchToList(item);
	}

	ccFunc(item: any) {
		console.log(this.cc.nativeElement);
	}

	bccFunc(item: any) {
		console.log(this.bcc.nativeElement);
	}
}
