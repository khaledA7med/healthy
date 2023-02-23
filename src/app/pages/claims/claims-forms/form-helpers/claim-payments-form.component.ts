import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import {
  IClaimPayment,
  IClaimPaymentForm,
} from "src/app/shared/app/models/Claims/iclaim-payment-form";

@Component({
  selector: "app-claim-payments-form",
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit(formGroup.value)">
      <div class="modal-header">
        <h4 class="modal-title" id="modal-basic-title">Payment Details</h4>
        <button
          type="button"
          class="btn-close btn-sm"
          aria-label="Close"
          (click)="modal.dismiss()"
        ></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-lg-12 my-1">
            <label class="asterisk-input">Payment Type </label>
            <ng-select
              class="is-invalid"
              [ngClass]="{
                'is-submitted':
                  (f.paymentType.touched || submitted) && f.paymentType.invalid
              }"
              formControlName="paymentType"
              placeholder="Payment Types"
              [items]="paymentTypes"
            ></ng-select>
            <span
              class="invalid-feedback fw-bold mt-0"
              *ngIf="
                (f.paymentType.touched || submitted) && f.paymentType.invalid
              "
              >Required</span
            >
          </div>
          <div class="col-lg-6 col-sm-12 my-1">
            <label for="amount" class="asterisk-input">Amount</label>
            <div class="input-group input-group-sm">
              <input
                type="text"
                class="form-control input-text-right"
                [ngClass]="{
                  'is-invalid':
                    (f.amount.touched || submitted) && f.amount.invalid
                }"
                InputMask
                formControlName="amount"
                id="amount"
                placeholder="0.00"
              />
              <span class="input-group-text">SAR</span>
              <span class="invalid-feedback fw-bold mt-0">Required</span>
            </div>
          </div>
          <div class="col-lg-6 col-sm-12 my-1">
            <label for="paymentDetails">Payment Reference</label>
            <input
              type="text"
              placeholder="Payment Reference"
              class="form-control form-control-sm"
              formControlName="paymentDetails"
              id="paymentDetails"
            />
          </div>
          <div class="col-lg-6 col-sm-12 my-1">
            <label for="bankName">Bank Name</label>
            <!-- [items]="(formData | async)?.bankNames?.content!" -->
            <ng-select
              placeholder="Bank Name"
              formControlName="bankName"
              bindLabel="name"
              bindValue="name"
              [loading]="formData ? false : true"
            >
              <ng-template ng-option-tmp let-item="item">
                <div>{{ item.name }}</div>
              </ng-template>
            </ng-select>
          </div>
          <div class="col-lg-6 col-sm-12 my-1">
            <label for="IBAN">IBAN</label>
            <input
              type="text"
              class="form-control form-control-sm"
              formControlName="IBAN"
              id="IBAN"
              placeholder="IBAN"
            />
          </div>
          <div class="col-lg-6 col-sm-12 my-1">
            <label for="dateofCheque">Date Of Cheque</label>
            <app-gregorian-picker
              [model]="f.dateofCheque.value"
              [required]="false"
              [submitted]="submitted"
              (dateChange)="dateOfChequeEvt($event)"
            ></app-gregorian-picker>
          </div>
          <div class="col-lg-6 col-sm-12 my-1">
            <label for="dateofPayment">Date Of Payments</label>
            <app-gregorian-picker
              [model]="f.dateofPayment.value"
              [required]="false"
              [submitted]="submitted"
              (dateChange)="dateofChequeEvt($event)"
            ></app-gregorian-picker>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-outline-danger btn-sm"
          (click)="modal.dismiss()"
        >
          Cancel
        </button>
        <button type="submit" class="btn btn-primary btn-sm">Save</button>
      </div>
    </form>
  `,
  styles: [],
})
export class ClaimPaymentsFormComponent implements OnInit, OnDestroy {
  @Input() data: IClaimPayment = {
    sNo: 0,
    claimsNo: 0,
    clientName: "",
    clientNo: 0,
    branch: "",
    amount: 0,
    paymentDetails: "",
    paymentType: "",
    bankName: "",
    IBAN: "",
    dateofCheque: new Date(),
    dateofPayment: new Date(),
  };

  submitted: boolean = false;
  editMode: boolean = false;

  paymentTypes: string[] = [
    "Direct Cheque To Client",
    "Direct Transfer To Client",
    "Amount Paid To Workshop",
    "Credit Note",
    "Debit Note",
    "Ex-gratia",
  ];

  subscribes: Subscription[] = [];

  formGroup!: FormGroup<IClaimPaymentForm>;
  formData!: Observable<IBaseMasterTable>;

  constructor(public modal: NgbActiveModal) {}

  initForm(): void {
    this.formGroup = new FormGroup<IClaimPaymentForm>({
      sNo: new FormControl(null),
      paymentType: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.required),
      bankName: new FormControl(null),
      branch: new FormControl(null),
      claimNo: new FormControl(null),
      clientName: new FormControl(null),
      clientNo: new FormControl(null),
      IBAN: new FormControl(null),
      paymentDetails: new FormControl(null),
      dateofCheque: new FormControl(null),
      dateofPayment: new FormControl(null),
    });
  }

  get f(): IClaimPaymentForm {
    return this.formGroup.controls;
  }

  dateOfChequeEvt(evt: any) {}
  dateofChequeEvt(evt: any) {}

  onSubmit(value: any): void {
    this.modal.close();
  }

  ngOnInit(): void {
    console.log(this.data);
    this.initForm();
    this.formGroup.patchValue({
      claimNo: this.data.claimsNo,
      clientName: this.data.clientName,
      clientNo: this.data.clientNo,
    });

    if (this.data.sNo) this.patchDataToForm();
  }

  patchDataToForm(): void {
    this.formGroup.patchValue({
      sNo: this.data.sNo,
      paymentType: this.data.paymentType,
      amount: this.data.amount,
      bankName: this.data.bankName,
      branch: this.data.branch,
      IBAN: this.data.IBAN,
      paymentDetails: this.data.paymentDetails,
    });
    // dateofCheque: this.data.,
    // dateofPayment: this.data.,
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
