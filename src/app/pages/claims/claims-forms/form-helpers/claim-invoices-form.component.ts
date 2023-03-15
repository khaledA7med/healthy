// import { HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IClaimInvoice, IClaimInvoiceForm } from "src/app/shared/app/models/Claims/iclaim-invoice-form";
import AppUtils from "src/app/shared/app/util";
import { ClaimsService } from "src/app/shared/services/claims/claims.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { SweetAlertResult } from "sweetalert2";

@Component({
	selector: "app-claim-invoices-form",
	template: `
		<app-sub-loader *ngIf="isLoading"></app-sub-loader>
		<form [formGroup]="formGroup" (ngSubmit)="onSubmit(formGroup)">
			<div class="modal-header">
				<h4 class="modal-title" id="modal-basic-title">Invoice Details</h4>
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
							<label for="others">Others</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="others"
									id="others"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="estimatedCharges">Estimated Charges</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="estimatedCharges"
									id="estimatedCharges"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
					</div>

					<div class="col-lg-6 col-md-12">
						<div class="my-1">
							<label for="VATInvoicesAmount">VAT Amount</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="VATInvoicesAmount"
									id="VATInvoicesAmount"
									placeholder="0.00"
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="discount">Discount</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									(input)="totalAmountCalc()"
									formControlName="discount"
									id="discount"
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
							<label for="grandTotal">Grand Total</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									formControlName="grandTotal"
									id="grandTotal"
									placeholder="0.00"
									readonly
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
						<div class="my-1">
							<label for="amountDue">Amount Due</label>
							<div class="input-group input-group-sm">
								<input
									type="text"
									class="form-control input-text-right"
									InputMask
									formControlName="amountDue"
									id="amountDue"
									placeholder="0.00"
									readonly
								/>
								<span class="input-group-text">SAR</span>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-lg-6">
						<div class="my-1">
							<label for="dateofPayment">Invoice Date</label>
							<app-gregorian-picker
								[model]="f.invoiceDate?.value"
								[required]="true"
								[submitted]="submitted"
								(dateChange)="invoiceDateEvt($event)"
							></app-gregorian-picker>
						</div>
						<div class="my-1">
							<label for="invoiceNo">Invoice No.</label>
							<input
								type="text"
								class="form-control form-control-sm"
								[ngClass]="{
									'is-invalid': (f.invoiceNo?.touched || submitted) && f.invoiceNo?.invalid
								}"
								formControlName="invoiceNo"
								id="invoiceNo"
								placeholder="Invoice No."
							/>
							<span class="invalid-feedback fw-bold mt-0">Required</span>
						</div>
					</div>
					<div class="col-lg-6 col-md-12">
						<div class="my-1">
							<label for="WIPNo">WIP No.</label>
							<input
								type="text"
								class="form-control form-control-sm"
								[ngClass]="{
									'is-invalid': (f.WIPNo?.touched || submitted) && f.WIPNo?.invalid
								}"
								formControlName="WIPNo"
								id="WIPNo"
								placeholder="WIP No."
							/>
							<span class="invalid-feedback fw-bold mt-0">Required</span>
						</div>
						<div class="my-1">
							<label for="chassisNo">Chassis No.</label>
							<input type="text" class="form-control form-control-sm" formControlName="chassisNo" id="chassisNo" placeholder="Chassis No." />
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
export class ClaimInvoicesFormComponent implements OnInit, OnDestroy {
	formGroup!: FormGroup<IClaimInvoiceForm>;
	@Input() data: IClaimInvoice = {
		sNo: 0,
		claimSNo: 0,
		clientNo: 0,
		clientName: "",
		chassisNo: "",
		labor: 0,
		towingCharges: 0,
		spareParts: 0,
		deductibleExcess: 0,
		discount: 0,
		amountDue: 0,
		estimatedCharges: 0,
		grandTotal: 0,
		invoiceDate: new Date(),
		invoiceNo: "",
		others: 0,
		vatInvoicesAmount: 0,
		wipNo: "",
	};

	@Output() invoiceList: EventEmitter<IClaimInvoice[]> = new EventEmitter<IClaimInvoice[]>();

	submitted: boolean = false;
	editMode: boolean = false;
	isLoading: boolean = false;

	subscribes: Subscription[] = [];
	constructor(public modal: NgbActiveModal, private util: AppUtils, private message: MessagesService, private claimService: ClaimsService) {}

	initForm(): void {
		this.formGroup = new FormGroup<IClaimInvoiceForm>({
			sNo: new FormControl(null),
			clientName: new FormControl(null),
			clientNo: new FormControl(null),
			claimSNo: new FormControl(null),
			amountDue: new FormControl(null),
			chassisNo: new FormControl(null),
			deductibleExcess: new FormControl(null),
			discount: new FormControl(null),
			estimatedCharges: new FormControl(null),
			grandTotal: new FormControl(null),
			invoiceDate: new FormControl(null, Validators.required),
			invoiceNo: new FormControl(null, Validators.required),
			labor: new FormControl(null),
			others: new FormControl(null),
			spareParts: new FormControl(null),
			towingCharges: new FormControl(null),
			VATInvoicesAmount: new FormControl(null),
			WIPNo: new FormControl(null, Validators.required),
		});
	}

	get f(): IClaimInvoiceForm {
		return this.formGroup.controls;
	}

	ngOnInit(): void {
		this.initForm();
		this.formGroup.patchValue({
			claimSNo: this.data.claimSNo,
			clientName: this.data.clientName,
			clientNo: this.data.clientNo,
		});
		if (this.data.sNo) this.patchDataToForm();
	}

	patchDataToForm(): void {
		this.formGroup.patchValue({
			sNo: this.data.sNo,
			invoiceDate: this.util.dateStructFormat(this.data.invoiceDate) as any,
			WIPNo: this.data.wipNo,
			amountDue: this.data.amountDue,
			chassisNo: this.data.chassisNo,
			deductibleExcess: this.data.deductibleExcess,
			discount: this.data.discount,
			estimatedCharges: this.data.estimatedCharges,
			grandTotal: this.data.grandTotal,
			invoiceNo: this.data.invoiceNo,
			labor: this.data.labor,
			others: this.data.others,
			spareParts: this.data.spareParts,
			towingCharges: this.data.towingCharges,
			VATInvoicesAmount: this.data.vatInvoicesAmount,
		});
	}

	totalAmountCalc(): void {
		let totals =
			+this.f.towingCharges?.value! +
			+this.f.labor?.value! +
			+this.f.spareParts?.value! +
			+this.f.others?.value! +
			+this.f.estimatedCharges?.value! +
			+this.f.VATInvoicesAmount?.value!;
		this.f.grandTotal?.patchValue(totals);
		this.f.amountDue?.patchValue(totals - +this.f.discount?.value! - +this.f.deductibleExcess?.value!);
	}

	invoiceDateEvt(e: any) {
		this.f.invoiceDate?.patchValue(e.gon);
	}

	validationChecker(): boolean {
		if (this.formGroup.invalid) {
			this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
			return false;
		}
		return true;
	}

	onSubmit(value: FormGroup<IClaimInvoiceForm>): void {
		this.submitted = true;
		if (!this.validationChecker()) return;
		if (+this.f.amountDue?.value! === 0)
			this.message
				.templateComfirmation("Are You Sure!", "<p>Amount Due = 0</p>", "Yes, Sure!", "primary", "question")
				.then((res: SweetAlertResult) => {
					if (res.isConfirmed) this.sendRequestData(value);
				});
		else this.sendRequestData(value);
	}

	sendRequestData(value: FormGroup<IClaimInvoiceForm>) {
		this.isLoading = true;
		const formData = new FormData();
		let val = value.getRawValue();
		formData.append("SNo", val.sNo ? val.sNo!.toString() : "0");
		formData.append("ClaimSNo", val.claimSNo?.toString()! ?? "0");
		formData.append("ClientNo", val.clientNo?.toString()! ?? "0");
		formData.append("ClientName", val.clientName!);

		formData.append("InvoiceNo", val.invoiceNo! ?? "");
		formData.append("InvoiceDate", this.util.dateFormater(val.invoiceDate!) as any);
		formData.append("WIPNo", val.WIPNo! ?? "");
		formData.append("ChassisNo", val.chassisNo! ?? "");
		formData.append("InvoiceNo", val.invoiceNo! ?? "");
		formData.append("Labor", val.labor ? val.labor.toString() : "0");
		formData.append("TowingCharges", val.towingCharges ? val.towingCharges.toString() : "0");
		formData.append("SpareParts", val.spareParts ? val.spareParts.toString() : "0");
		formData.append("Others", val.others ? val.others.toString() : "0");
		formData.append("EstimatedCharges", val.estimatedCharges ? val.estimatedCharges.toString() : "0");
		formData.append("GrandTotal", val.grandTotal ? val.grandTotal.toString() : "0");
		formData.append("DeductibleExcess", val.deductibleExcess ? val.deductibleExcess.toString() : "0");
		formData.append("Discount", val.discount ? val.discount.toString() : "0");
		formData.append("VATInvoicesAmount", val.VATInvoicesAmount ? val.VATInvoicesAmount.toString() : "0");
		formData.append("AmountDue", val.amountDue ? val.amountDue.toString() : "0");

		let sub = this.claimService.saveClaimInvoice(formData).subscribe(
			(res: IBaseResponse<IClaimInvoice[]>) => {
				if (res.status) {
					this.message.toast(res.message!, "success");
					this.invoiceList.emit(res.data);
					this.modal.close();
				} else this.message.popup("Oops!", res.message!, "warning");
				this.isLoading = false;
			}
			// (err: HttpErrorResponse) => {
			//   this.message.popup("Oops!", err.message, "error");
			//   this.isLoading = false;
			// }
		);
		this.subscribes.push(sub);
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
