import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IClaimApproval, IClaimApprovalForm } from "src/app/shared/app/models/Claims/iclaim-approval-form";
import AppUtils from "src/app/shared/app/util";
import { ClaimsService } from "src/app/shared/services/claims/claims.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { SweetAlertResult } from "sweetalert2";

@Component({
	selector: "app-claim-approvals-form",
	template: `
		<app-sub-loader *ngIf="isLoading"></app-sub-loader>
		<form [formGroup]="formGroup" (ngSubmit)="onSubmit(formGroup)">
			<div class="modal-header">
				<h4 class="modal-title" id="modal-basic-title">Approval Details</h4>
				<button type="button" class="btn-close btn-sm" aria-label="Close" (click)="modal.dismiss()"></button>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-lg-6 col-md-12">
						<div class="my-1">
							<label for="labor">Labor</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="labor"
									id="labor"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="towingCharges">Towing Charges</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="towingCharges"
									id="towingCharges"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="spareParts">Spare Parts</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="spareParts"
									id="spareParts"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="material">Material</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="material"
									id="material"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="totalLoss">Total Loss</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="totalLoss"
									id="totalLoss"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="lumpsumAmount">Lumpsum Amount</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="lumpsumAmount"
									id="lumpsumAmount"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="VATAmount">VAT Amount</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="VATAmount"
									id="VATAmount"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
					</div>

					<div class="col-lg-6 col-md-12">
						<div class="my-1">
							<label for="depreciation">Depreciation</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="depreciation"
									id="depreciation"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="deductibleExcess">Deductible Excess</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="deductibleExcess"
									id="deductibleExcess"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="discounts">Discounts</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="discounts"
									id="discounts"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="totalAmount">Total Amount</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									formControlName="totalAmount"
									id="totalAmount"
									placeholder="0.00"
									readonly
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="netAmount">Net Amount</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									formControlName="netAmount"
									id="netAmount"
									placeholder="0.00"
									readonly
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="chassisNo">Chassis/Item No.</label>
							<input type="text" class="form-control form-control-sm" formControlName="chassisNo" id="chassisNo" placeholder="Chassis/Item No." />
						</div>
						<div class="my-1">
							<label for="dateofPayment">Date Of Payments</label>
							<app-gregorian-picker
								[model]="f.approvalDate.value"
								[required]="true"
								[submitted]="submitted"
								(dateChange)="approvalDateEvt($event)"
							></app-gregorian-picker>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-outline-danger btn-sm" (click)="modal.dismiss()">Cancel</button>
				<button type="submit" class="btn btn-primary btn-sm">Save</button>
			</div>
		</form>
	`,
	styles: [],
})
export class ClaimApprovalsFormComponent implements OnInit, OnDestroy {
	formGroup!: FormGroup<IClaimApprovalForm>;
	@Input() data: IClaimApproval = {
		sNo: 0,
		claimSNo: 0,
		clientNo: 0,
		clientName: "",
		chassisNo: "",
		labor: 0,
		towingCharges: 0,
		spareParts: 0,
		material: 0,
		lumpsumAmount: 0,
		totalAmount: 0,
		deductibleExcess: 0,
		depreciation: 0,
		netAmount: 0,
		totalLoss: 0,
		vatAmount: 0,
		discounts: 0,
		approvalDate: new Date(),
	};

	@Output() approvalList: EventEmitter<IClaimApproval[]> = new EventEmitter<IClaimApproval[]>();

	submitted: boolean = false;
	editMode: boolean = false;
	isLoading: boolean = false;
	subscribes: Subscription[] = [];
	constructor(public modal: NgbActiveModal, private util: AppUtils, private message: MessagesService, private claimService: ClaimsService) {}

	ngOnInit(): void {
		this.initForm();

		this.formGroup.patchValue({
			claimSNo: this.data.claimSNo,
			clientName: this.data.clientName,
			clientNo: this.data.clientNo,
		});
		if (this.data.sNo) this.patchDataToForm();
		this.totalAmountCalc();
	}

	initForm(): void {
		this.formGroup = new FormGroup<IClaimApprovalForm>({
			sNo: new FormControl(null),
			claimSNo: new FormControl(null),
			clientNo: new FormControl(null),
			clientName: new FormControl(null),
			chassisNo: new FormControl(null),
			labor: new FormControl(null),
			towingCharges: new FormControl(null),
			spareParts: new FormControl(null),
			material: new FormControl(null),
			lumpsumAmount: new FormControl(null),
			totalAmount: new FormControl(null),
			deductibleExcess: new FormControl(null),
			depreciation: new FormControl(null),
			netAmount: new FormControl(null),
			totalLoss: new FormControl(null),
			VATAmount: new FormControl(null),
			discounts: new FormControl(null),
			approvalDate: new FormControl(null, Validators.required),
		});
	}

	get f(): IClaimApprovalForm {
		return this.formGroup.controls;
	}

	patchDataToForm(): void {
		this.formGroup.patchValue({
			sNo: this.data.sNo,
			approvalDate: this.util.dateStructFormat(this.data.approvalDate) as any,
			chassisNo: this.data.chassisNo,
			deductibleExcess: this.data.deductibleExcess,
			depreciation: this.data.depreciation,
			discounts: this.data.discounts,
			labor: this.data.labor,
			lumpsumAmount: this.data.lumpsumAmount,
			material: this.data.material,
			netAmount: this.data.netAmount,
			spareParts: this.data.spareParts,
			totalAmount: this.data.totalAmount,
			totalLoss: this.data.totalLoss,
			towingCharges: this.data.towingCharges,
			VATAmount: this.data.vatAmount,
		});
	}

	totalAmountCalc(): void {
		let totals =
			+this.f.towingCharges.value! +
			+this.f.spareParts.value! +
			+this.f.material.value! +
			+this.f.totalLoss.value! +
			+this.f.lumpsumAmount.value! +
			+this.f.VATAmount.value! +
			+this.f.labor.value!;

		this.f.totalAmount.patchValue(totals);
		this.f.netAmount.patchValue(totals - +this.f.deductibleExcess.value! - +this.f.discounts.value! - +this.f.depreciation.value!);
	}

	approvalDateEvt(evt: any) {
		this.f.approvalDate.patchValue(evt.gon);
	}

	validationChecker(): boolean {
		if (this.formGroup.invalid) {
			this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
			return false;
		}
		return true;
	}

	onSubmit(value: FormGroup<IClaimApprovalForm>) {
		this.submitted = true;
		if (!this.validationChecker()) return;
		if (+this.f.netAmount.value! === 0) {
			this.message
				.templateComfirmation("Are You Sure!", "<p>Net Amount = 0</p>", "Yes, Sure!", "primary", "question")
				.then((result: SweetAlertResult) => {
					if (result.isConfirmed) this.sendRequestData(value);
				});
		} else this.sendRequestData(value);
	}

	sendRequestData(value: FormGroup<IClaimApprovalForm>) {
		const formData = new FormData();
		let val = value.getRawValue();

		formData.append("SNo", val.sNo ? val.sNo!.toString() : "0");
		formData.append("ClaimSNo", val.claimSNo?.toString()! ?? "0");
		formData.append("ClientNo", val.clientNo?.toString()! ?? "0");
		formData.append("ClientName", val.clientName! ?? "");
		formData.append("ChassisNo", val.chassisNo! ?? "");
		formData.append("Labor", val.labor ? val.labor?.toString() : "0");
		formData.append("TowingCharges", val.towingCharges ? val.towingCharges?.toString() : "0");
		formData.append("SpareParts", val.spareParts ? val.spareParts?.toString() : "0");
		formData.append("Material", val.material ? val.material?.toString() : "0");
		formData.append("LumpsumAmount", val.lumpsumAmount ? val.lumpsumAmount?.toString() : "0");
		formData.append("TotalAmount", val.totalAmount ? val.totalAmount?.toString() : "0");
		formData.append("DeductibleExcess", val.deductibleExcess ? val.deductibleExcess?.toString() : "0");
		formData.append("Depreciation", val.depreciation ? val.depreciation?.toString() : "0");
		formData.append("NetAmount", val.netAmount ? val.netAmount?.toString() : "0");
		formData.append("TotalLoss", val.totalLoss ? val.totalLoss?.toString() : "0");
		formData.append("VATAmount", val.VATAmount ? val.VATAmount?.toString() : "0");
		formData.append("Discounts", val.discounts ? val.discounts?.toString() : "0");
		formData.append("ApprovalDate", this.util.dateFormater(val.approvalDate) as any);

		let sub = this.claimService.saveClaimApproval(formData).subscribe((res: IBaseResponse<IClaimApproval[]>) => {
			if (res.status) {
				this.message.toast(res.message!, "success");
				this.approvalList.emit(res.data);
				this.modal.close();
			} else this.message.popup("Oops!", res.message!, "warning");
		});
		this.subscribes.push(sub);
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
