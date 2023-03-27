import { Component, ElementRef, ViewChild } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";
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
	private params!: ICellRendererParams;
	public comp!: ClientContactsComponent;

	@ViewChild("to") to!: ElementRef;
	@ViewChild("cc") cc!: ElementRef;
	@ViewChild("bcc") bcc!: ElementRef;

	constructor() {}

	agInit(params: ICellRendererParams) {
		this.params = params;
		this.comp = this.params.context.comp;
	}

	toFunc() {
		console.log(this.to.nativeElement);
	}

	ccFunc() {
		console.log(this.cc.nativeElement);
	}

	bccFunc() {
		console.log(this.bcc.nativeElement);
	}
}
