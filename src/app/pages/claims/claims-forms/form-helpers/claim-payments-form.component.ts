import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import {
  IClaimPayment,
  IClaimPaymentForm,
} from "src/app/shared/app/models/Claims/iclaim-payment-form";
import AppUtils from "src/app/shared/app/util";
import { ClaimsService } from "src/app/shared/services/claims/claims.service";
import { MessagesService } from "src/app/shared/services/messages.service";

@Component({
  selector: "app-claim-payments-form",
  template: `
    <app-sub-loader *ngIf="isLoading"></app-sub-loader>
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit(formGroup)">
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
            <ng-select
              [items]="(formData | async)?.Banks?.content!"
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
              (dateChange)="datesHandler($event, f.dateofCheque)"
            ></app-gregorian-picker>
          </div>
          <div class="col-lg-6 col-sm-12 my-1">
            <label for="dateofPayment">Date Of Payments</label>
            <app-gregorian-picker
              [model]="f.dateofPayment.value"
              [required]="false"
              [submitted]="submitted"
              (dateChange)="datesHandler($event, f.dateofPayment)"
            ></app-gregorian-picker>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary btn-sm">Save</button>
        <button
          type="button"
          class="btn btn-outline-danger btn-sm"
          (click)="modal.dismiss()"
        >
          Cancel
        </button>
      </div>
    </form>
  `,
  styles: [],
})
export class ClaimPaymentsFormComponent implements OnInit, OnDestroy {
  @Input() data: IClaimPayment = {
    sNo: 0,
    claimSNo: 0,
    clientName: "",
    clientNo: 0,
    branch: "",
    amount: 0,
    paymentDetails: "",
    paymentType: "",
    bankName: "",
    iban: "",
    dateofCheque: new Date(),
    dateofPayment: new Date(),
  };

  submitted: boolean = false;
  editMode: boolean = false;
  isLoading: boolean = false;
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
  @Output() paymentList: EventEmitter<IClaimPayment[]> = new EventEmitter<
    IClaimPayment[]
  >();
  constructor(
    public modal: NgbActiveModal,
    private util: AppUtils,
    private tables: MasterTableService,
    private message: MessagesService,
    private claimService: ClaimsService
  ) {}

  initForm(): void {
    this.formGroup = new FormGroup<IClaimPaymentForm>({
      sNo: new FormControl(null),
      paymentType: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.required),
      bankName: new FormControl(null),
      branch: new FormControl(null),
      claimSNo: new FormControl(null),
      clientName: new FormControl(null),
      clientNo: new FormControl(null),
      IBAN: new FormControl(null),
      paymentDetails: new FormControl(null),
      dateofCheque: new FormControl(
        this.util.dateStructFormat(new Date()) as any
      ),
      dateofPayment: new FormControl(
        this.util.dateStructFormat(new Date()) as any
      ),
    });
  }

  get f(): IClaimPaymentForm {
    return this.formGroup.controls;
  }

  datesHandler(e: any, control: FormControl): void {
    control.patchValue(e.gon);
  }

  onSubmit(data: FormGroup<IClaimPaymentForm>): void {
    if (!this.validationChecker()) return;
    this.isLoading = true;
    const formData = new FormData();
    let val = data.getRawValue();

    formData.append("SNo", val.sNo ? val.sNo!.toString() : "0");
    formData.append("ClaimSNo", val.claimSNo?.toString()! ?? "0");
    formData.append("ClientNo", val.clientNo?.toString()! ?? "0");
    formData.append("ClientName", val.clientName!);
    formData.append("Amount", val.amount?.toString() ?? "0");
    formData.append("PaymentDetails", val.paymentDetails ?? "");
    formData.append("PaymentType", val.paymentType ?? "");
    formData.append("IBAN", val.IBAN!);
    formData.append(
      "DateofCheque",
      this.util.dateFormater(val.dateofCheque) as any
    );
    formData.append(
      "DateofPayment",
      this.util.dateFormater(val.dateofPayment) as any
    );
    formData.append("BankName", val.bankName ?? "");

    let sub = this.claimService.saveClaimPayment(formData).subscribe(
      (res: IBaseResponse<IClaimPayment[]>) => {
        if (res.status) {
          this.message.toast(res.message!, "success");
          this.paymentList.emit(res.data);
          this.modal.close();
        } else this.message.popup("Oops!", res.message!, "warning");
        this.isLoading = false;
      },
      (err: HttpErrorResponse) => {
        this.message.popup("Oops!", err.message, "error");
        this.isLoading = false;
      }
    );
    this.subscribes.push(sub);
  }

  ngOnInit(): void {
    this.initForm();
    this.formData = this.tables.getBaseData(MODULES.ClaimsForm);
    this.formGroup.patchValue({
      claimSNo: this.data.claimSNo,
      clientName: this.data.clientName,
      clientNo: this.data.clientNo,
    });

    if (this.data.sNo) this.patchDataToForm();
  }

  validationChecker(): boolean {
    if (this.formGroup.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  patchDataToForm(): void {
    this.formGroup.patchValue({
      sNo: this.data.sNo,
      paymentType: this.data.paymentType,
      amount: this.data.amount,
      bankName: this.data.bankName,
      branch: this.data.branch,
      IBAN: this.data.iban,
      paymentDetails: this.data.paymentDetails,
      dateofCheque: this.util.dateStructFormat(this.data.dateofCheque) as any,
      dateofPayment: this.util.dateStructFormat(this.data.dateofPayment) as any,
    });
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
