import { HttpResponse } from "@angular/common/http";
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { Roles } from "src/app/core/roles/Roles";
import { PermissionsService } from "src/app/core/services/permissions.service";
import Swal from "sweetalert2";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { IDocumentList } from "../../app/models/App/IDocument";
import { IDocumentReq } from "../../app/models/App/IDocumentReq";
import { IChangePolicyStatusRequest } from "../../app/models/Production/i-policy-change-status-req";
import { IPolicyPreview } from "../../app/models/Production/ipolicy-preview";
import AppUtils from "../../app/util";
import { MessagesService } from "../../services/messages.service";
import { ProductionService } from "../../services/production/production.service";

@Component({
	selector: "app-poilcy-preview",
	templateUrl: "./poilcy-preview.component.html",
	styleUrls: ["./poilcy-preview.component.scss"],
})
export class PoilcyPreviewComponent implements OnInit, OnDestroy {
	@Input() data!: {
		id: string;
	};
	uiState = {
		sno: "" as string,
		policyDetails: {} as IPolicyPreview,
		loadedData: false as boolean,
		updatedState: false as boolean,
		documentList: [],
		privileges: ProductionPermissions,
	};

	modalRef!: NgbModalRef;

	deliveryStatus: FormControl = new FormControl(null, Validators.required);

	subscribes: Subscription[] = [];

	permissions$!: Observable<string[]>;

	lookupData!: Observable<IBaseMasterTable>;

	@ViewChild("details") detailsModal!: TemplateRef<any>;

	constructor(
		private message: MessagesService,
		private productinService: ProductionService,
		public util: AppUtils,
		public modal: NgbActiveModal,
		private privileges: PermissionsService,
		private modalService: NgbModal
	) {}

	ngOnInit(): void {
		this.permissions$ = this.privileges.getPrivileges(Roles.Production);
		this.uiState.sno = this.data.id;
		this.getPolicyDetails(this.uiState.sno);
	}

	getPolicyDetails(id: string): void {
		let sub = this.productinService.getPolicyById(id).subscribe({
			next: (res: IBaseResponse<IPolicyPreview>) => {
				if (res.status) {
					this.uiState.loadedData = true;
					this.uiState.policyDetails = res.data!;
					this.uiState.policyDetails.issueDate =
						String(this.uiState.policyDetails.issueDate) == "-" ? undefined : this.uiState.policyDetails.issueDate;
					this.uiState.policyDetails.periodFrom =
						String(this.uiState.policyDetails.periodFrom) == "-" ? undefined : this.uiState.policyDetails.periodFrom;
					this.uiState.policyDetails.periodTo = String(this.uiState.policyDetails.periodTo) == "-" ? undefined : this.uiState.policyDetails.periodTo;
					this.customizeClientDocuments();
				} else this.message.popup("Oops!", res.message!, "error");
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
		});
		this.subscribes.push(sub);
	}

	changeStatus(newStatus: string): void {
		let reqBody: IChangePolicyStatusRequest = {
			status: newStatus,
			sno: Number(this.uiState.policyDetails.sNo),
			done: this.uiState.policyDetails.done,
			reject: this.uiState.policyDetails.reject,
			endorsType: this.uiState.policyDetails.endorsType,
			sumInsur: this.uiState.policyDetails.sumInsur,
			netPremium: this.uiState.policyDetails.netPremium,
			vatValue: this.uiState.policyDetails.vatValue,
			fees: this.uiState.policyDetails.fees,
			totalPremium: this.uiState.policyDetails.totalPremium,
			compComm: this.uiState.policyDetails.compComm,
			compCommVat: this.uiState.policyDetails.compCommVAT,
			producerComm: this.uiState.policyDetails.producerComm,
			mgrAprovedUser: this.uiState.policyDetails.mgrAprovedUser,
			prodRejectInfo: this.uiState.policyDetails.prodRejectInfo,
			prodRejecType: this.uiState.policyDetails.prodRejecType,
			savedUser: this.uiState.policyDetails.savedUser,
			policyNo: this.uiState.policyDetails.policyNo,
			clientName: this.uiState.policyDetails.clientName,
			className: this.uiState.policyDetails.className,
			issueDate: this.uiState.policyDetails.issueDate,
			periodTo: this.uiState.policyDetails.periodTo,
			producersCommissionsList: this.uiState.policyDetails.producersCommissionsList,
		};
		if (newStatus === "Approve") {
			this.message.confirm(`${newStatus} it !`, `${newStatus} it`, "success", "warning").then((result: any) => {
				if (result.isConfirmed) {
					let sub = this.productinService.changeStatus(reqBody).subscribe({
						next: (res: HttpResponse<IBaseResponse<null>>) => {
							if (res.body?.status) {
								this.message.toast(res.body?.message!, "success");
								this.uiState.updatedState = true;
								this.backToMainRoute();
							}
						},
					});
					this.subscribes.push(sub);
				}
			});
		} else {
			this.changeStatusWithMsg(reqBody);
		}
	}

	changeStatusWithMsg(reqBody: IChangePolicyStatusRequest) {
		return Swal.fire({
			title: "Type Rejection Reason",
			input: "text",
			inputAttributes: {
				required: "true",
			},
			validationMessage: "Required",
			showCancelButton: true,
			background: "var(--vz-modal-bg)",
			customClass: {
				confirmButton: "btn btn-success btn-sm w-xs me-2 mt-2",
				cancelButton: "btn btn-ghost-danger btn-sm w-xs mt-2",
				input: "customize-swlInput",
				validationMessage: "fs-6 bg-transparent  m-1 p-1",
			},
			confirmButtonText: `Reject`,
			buttonsStyling: false,
			showCloseButton: true,
			showLoaderOnConfirm: true,
			allowOutsideClick: false,
			preConfirm: (inputValue: string) => {
				reqBody = {
					...reqBody,
					prodRejectInfo: inputValue,
				};
			},
		}).then((result) => {
			if (result.isConfirmed) {
				let sub = this.productinService.changeStatus(reqBody).subscribe({
					next: (res: HttpResponse<IBaseResponse<null>>) => {
						if (res.body?.status) {
							this.message.toast(res.body?.message!, "success");
							this.uiState.updatedState = true;
							this.backToMainRoute();
						}
					},
				});
				this.subscribes.push(sub);
			}
		});
	}

	changeDeliveryStatus(status: string) {
		let data: {
			policyNo: string;
			deliveryStatus: string;
		} = { policyNo: this.uiState.policyDetails.sNo!.toString(), deliveryStatus: status };

		let sub = this.productinService.changeDeliveryStatus(data).subscribe((res: IBaseResponse<null>) => {
			this.message.toast(res?.message!, "success");
			this.uiState.updatedState = true;
			this.backToMainRoute();
		});
		this.subscribes.push(sub);
	}

	// To Do back to main route when close modal
	backToMainRoute() {
		this.modal.dismiss();
	}

	ngOnDestroy() {
		this.subscribes.forEach((s) => s.unsubscribe());
	}
}
