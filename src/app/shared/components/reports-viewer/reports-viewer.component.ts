import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
@Component({
	selector: "app-reports-viewer",
	template: `
		<div class="modal-header">
			<h4 class="modal-title" id="modal-basic-title">{{ data.reportName }}</h4>
			<button type="button" class="btn-close btn-sm" aria-label="Close" (click)="modal.dismiss()"></button>
		</div>
		<div class="modal-body reports-body mx-auto">
			<iframe
				[src]="data.url | safe"
				class="myIFrame justify-content-center"
				frameborder="5"
				width="100%"
				height="99%"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
		</div>
		<div class="modal-footer py-0">
			<button type="button" class="btn btn-outline-danger btn-sm" (click)="modal.dismiss()">Close</button>
		</div>
	`,
	styles: [
		`
			.myIFrame {
				border: none;
			}
			.reports-body {
				width: 100%;
				height: 100vh;
			}
			.dark-modal .modal-content {
				background-color: #292b2c;
				color: white;
			}
			/* .modal-body {
				overflow-y: auto;
			} */
			.dark-modal .close {
				color: white;
			}
			.light-blue-backdrop {
				background-color: #5cb3fd;
			}
		`,
	],
})
export class ReportsViewerComponent implements OnInit, OnDestroy {
	@Input() data!: {
		reportName: string;
		url: string;
	};
	subscribes: Subscription[] = [];

	constructor(public modal: NgbActiveModal) {}
	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}

	ngOnInit(): void {}
}
