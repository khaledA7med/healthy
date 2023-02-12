import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IDocumentList } from "../../app/models/App/IDocument";
import { IDocumentReq } from "../../app/models/App/IDocumentReq";
import { IPolicyPreview } from "../../app/models/Production/ipolicy-preview";
import AppUtils from "../../app/util";
import { MessagesService } from "../../services/messages.service";
import { ProductionService } from "../../services/production/production.service";

@Component({
	selector: "app-poilcy-preview",
	templateUrl: "./poilcy-preview.component.html",
	styleUrls: ["./poilcy-preview.component.scss"],
	providers: [AppUtils],
})
export class PoilcyPreviewComponent implements AfterViewInit, OnDestroy {
	uiState = {
		sno: 0,
		policyDetails: {} as IPolicyPreview,
		updatedState: false,
		documentList: [],
	};

	subscribes: Subscription[] = [];
	previewModalRef!: NgbModalRef;
	addToGroupModalRef!: NgbModalRef;
	addClientToGroupForm!: FormGroup;
	lookupData!: Observable<IBaseMasterTable>;
	@ViewChild("details") detailsModal!: TemplateRef<any>;
	constructor(
		private modalService: NgbModal,
		private route: ActivatedRoute,
		private router: Router,
		private message: MessagesService,
		private productinService: ProductionService,
		private table: MasterTableService,
		public util: AppUtils
	) {}

	ngAfterViewInit(): void {
		this.openPreviewModal();
		this.getSNO();
		this.getPolicyDetails(this.uiState.sno);
	}

	openPreviewModal(): void {
		this.previewModalRef = this.modalService.open(this.detailsModal, {
			fullscreen: true,
		});
		this.backToMainRoute();
	}

	getSNO(): void {
		this.route.paramMap.subscribe((res) => {
			this.uiState.sno = Number(res.get("sno")!);
		});
	}

	getPolicyDetails(sno: number): void {
		let sub = this.productinService.getPolicyById(sno).subscribe({
			next: (res: HttpResponse<IBaseResponse<IPolicyPreview>>) => {
				this.uiState.policyDetails = res.body?.data!;
				// AppUtils.nullValues(this.uiState.policyDetails);
				// this.customizeClientDocuments();
			},
			error: (error: HttpErrorResponse) => {
				this.message.popup("Oops!", error.message, "error");
			},
		});
		this.subscribes.push(sub);
	}

	customizeClientDocuments() {
		this.uiState.policyDetails.documentLists?.forEach((el: IDocumentList) => {
			switch (el.type) {
				case "zip":
					(el.className = "zip-fill"), (el.colorName = "text-success");
					break;
				case "pdf":
					(el.className = "pdf-line"), (el.colorName = "text-danger");
					break;
				case "csv":
					(el.className = "code-fill"), (el.colorName = "text-primary");
					break;
				case "txt":
					(el.className = "text-fill"), (el.colorName = "text-dark");
					break;
				case "docx":
				case "doc":
					(el.className = "word-2-fill"), (el.colorName = "text-primary");
					break;
				case "xls":
				case "xlsx":
					(el.className = "excel-2-fill"), (el.colorName = "text-success");
					break;
				case "ppt":
				case "pptx":
					(el.className = "ppt-2-fill"), (el.colorName = "text-danger");
					break;
				case "image":
					break;
				default:
					(el.className = "warning-fill"), (el.colorName = "text-warning");
			}

			el.size = this.util.formatBytes(+el?.size!);
		});
	}

	deleteFile(index: number, path: string) {
		let data: IDocumentReq = {
			module: "Production",
			path: "",
			sno: 0,
		};
		this.message.confirm(` Delete it !`, ` Delete it !`, "danger", "warning").then((result: any) => {
			if (result.isConfirmed) {
				let sub = this.productinService.deleteDocument(data).subscribe({
					next: (res) => {
						if (res.body?.status === true) {
							this.message.toast(res.body?.message!, "success");
							this.uiState.policyDetails.documentLists?.splice(index, 1);
						} else this.message.popup("Sorry", res.body?.message!, "warning");
					},
					error: (error) => {
						this.message.popup("Oops!", error.message, "error");
					},
				});
				this.subscribes.push(sub);
			}
		});
	}

	downloadFile(path: string) {
		let data: IDocumentReq = {
			module: "Production",
			path: "",
			sno: 0,
		};
		let sub = this.productinService.downloadDocument(data).subscribe({
			next: (res) => {
				const downloadedFile = new Blob([res.body as BlobPart], {
					type: res.body,
				});
				const a = document.createElement("a");
				a.setAttribute("style", "display:none;");
				document.body.appendChild(a);
				a.download = path;
				a.href = URL.createObjectURL(downloadedFile);
				a.target = "_blank";
				a.click();
				document.body.removeChild(a);
			},
			error: (error) => {
				this.message.popup("Oops!", error.message, "error");
			},
		});
		this.subscribes.push(sub);
	}

	// changeStatus(newStatus: string): void {
	// 	let reqBody = {
	// 		clientId: this.uiState.sno,
	// 		status: newStatus,
	// 	};

	// 	if (newStatus === ClientStatus.Rejected) {
	// 		this.changeStatusWithMsg(reqBody);
	// 	} else {
	// 		this.message.confirm(`${newStatus} it !`, `${newStatus} it`, "success", "warning").then((result: any) => {
	// 			if (result.isConfirmed) {
	// 				let sub = this.clientService.changeStatus(reqBody).subscribe({
	// 					next: (res: HttpResponse<IBaseResponse<null>>) => {
	// 						this.message.toast(res.body?.message!, "success");
	// 						this.uiState.updatedState = true;
	// 						this.previewModalRef.close();
	// 						this.backToMainRoute();
	// 					},
	// 					error: (error: HttpErrorResponse) => {
	// 						this.message.popup("Oops!", error.message, "error");
	// 					},
	// 				});
	// 				this.subscribes.push(sub);
	// 			}
	// 		});
	// 	}
	// }

	// changeStatusWithMsg(reqBody: IChangeStatusRequest) {
	// 	return Swal.fire({
	// 		title: "Type Rejection Reason",
	// 		input: "text",
	// 		inputAttributes: {
	// 			required: "true",
	// 		},
	// 		validationMessage: "Required",
	// 		showCancelButton: true,
	// 		background: "var(--vz-modal-bg)",
	// 		customClass: {
	// 			confirmButton: "btn btn-success btn-sm w-xs me-2 mt-2",
	// 			cancelButton: "btn btn-ghost-danger btn-sm w-xs mt-2",
	// 			input: "customize-swlInput",
	// 			validationMessage: "fs-6 bg-transparent  m-1 p-1",
	// 		},
	// 		confirmButtonText: `Reject`,
	// 		buttonsStyling: false,
	// 		showCloseButton: true,
	// 		showLoaderOnConfirm: true,
	// 		allowOutsideClick: false,
	// 		preConfirm: (inputValue: string) => {
	// 			reqBody = {
	// 				...reqBody,
	// 				rejectionReason: inputValue,
	// 			};
	// 		},
	// 	}).then((result) => {
	// 		if (result.isConfirmed) {
	// 			let sub = this.clientService.changeStatus(reqBody).subscribe({
	// 				next: (res: HttpResponse<IBaseResponse<null>>) => {
	// 					this.message.toast(res.body?.message!, "success");
	// 					this.uiState.updatedState = true;
	// 					this.previewModalRef.close();
	// 					this.backToMainRoute();
	// 				},
	// 				error: (error: HttpErrorResponse) => {
	// 					this.message.popup("Oops!", error.message, "error");
	// 				},
	// 			});
	// 			this.subscribes.push(sub);
	// 		}
	// 	});
	// }

	// To Do back to main route when close modal

	backToMainRoute() {
		this.previewModalRef.hidden.subscribe(() => {
			this.router.navigate([{ outlets: { details: null } }], {
				state: { updated: this.uiState.updatedState },
			});
		});
	}

	ngOnDestroy() {
		this.subscribes.forEach((s) => s.unsubscribe());
	}
}