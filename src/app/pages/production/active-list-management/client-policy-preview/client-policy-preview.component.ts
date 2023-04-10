import { HttpResponse } from "@angular/common/http";
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { Roles } from "src/app/core/roles/Roles";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IPolicyPreview } from "src/app/shared/app/models/Production/ipolicy-preview";
import AppUtils from "src/app/shared/app/util";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";
import Swal from "sweetalert2";
import { UploadExcelListComponent } from "./upload-excel-list/upload-excel-list.component";

@Component({
	selector: "app-client-policy-preview",
	templateUrl: "./client-policy-preview.component.html",
	styleUrls: ["./client-policy-preview.component.scss"],
})
export class ClientPolicyPreviewComponent implements OnInit, OnDestroy {
	@Input() data!: {
		id: string;
	};
	uiState = {
		sno: "" as string,
		showMotorBtn: false as boolean,
		showMedicalBtn: false as boolean,
		policyDetails: {} as IPolicyPreview,
		loadedData: false as boolean,
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
		let sub = this.productinService.getActivePolicy(id).subscribe({
			next: (res: IBaseResponse<IPolicyPreview>) => {
				if (res.status) {
					this.uiState.loadedData = true;
					this.uiState.policyDetails = res.data!;
					this.uiState.policyDetails.issueDate =
						String(this.uiState.policyDetails.issueDate) == "-" ? undefined : this.uiState.policyDetails.issueDate;
					this.uiState.policyDetails.periodFrom =
						String(this.uiState.policyDetails.periodFrom) == "-" ? undefined : this.uiState.policyDetails.periodFrom;
					this.uiState.policyDetails.periodTo = String(this.uiState.policyDetails.periodTo) == "-" ? undefined : this.uiState.policyDetails.periodTo;
					this.checkPolicyType();
				} else this.message.popup("Oops!", res.message!, "error");
			},
		});

		this.subscribes.push(sub);
	}

	checkPolicyType() {
		if (this.uiState.policyDetails.className === "Motor") {
			this.uiState.showMotorBtn = true;
			this.uiState.showMedicalBtn = false;
		} else if (this.uiState.policyDetails.className === "Medical") {
			this.uiState.showMotorBtn = false;
			this.uiState.showMedicalBtn = true;
		} else {
			this.uiState.showMotorBtn = false;
			this.uiState.showMedicalBtn = false;
		}
	}

	// To Do back to main route when close modal
	backToMainRoute() {
		this.modal.dismiss();
	}

	// Open Excel Uploading Modal
	openUploadFromExcelModal(id: string) {
		this.modalRef = this.modalService.open(UploadExcelListComponent, {
			size: "xl",
			scrollable: true,
			centered: true,
		});

		this.modalRef.componentInstance.data = {
			id,
			className: this.uiState.policyDetails.className,
			clientID: this.uiState.policyDetails.clientNo,
			oasisPOlRef: this.uiState.policyDetails.oasisPolRef,
			PoliciesSno: this.uiState.policyDetails.policiesSNo,
			PolicyNo: this.uiState.policyDetails.policyNo,
		};
	}

	ngOnDestroy() {
		this.subscribes.forEach((s) => s.unsubscribe());
	}
}
