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
  IClaimRejectDeduct,
  IClaimRejectDeductForm,
  RejectDeduct,
} from "src/app/shared/app/models/Claims/iclaim-reject-deduct-form";
import AppUtils from "src/app/shared/app/util";
import { ClaimsService } from "src/app/shared/services/claims/claims.service";
import { MessagesService } from "src/app/shared/services/messages.service";

@Component({
  selector: "app-claim-reject-deduct-form",
  template: `
    <app-sub-loader *ngIf="isLoading"></app-sub-loader>
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <div class="modal-header">
        <h4 class="modal-title" id="modal-basic-title">
          Rejection/Deduction Details
        </h4>
        <button
          type="button"
          class="btn-close btn-sm"
          aria-label="Close"
          (click)="modal.dismiss()"
        ></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-lg-6 col-md-12 my-1">
            <label class="asterisk-input">Type</label>
            <ng-select
              class="is-invalid"
              [ngClass]="{
                'is-submitted':
                  (f.type?.touched || submitted) && f.type?.invalid
              }"
              formControlName="type"
              placeholder="Types"
              [items]="types"
            ></ng-select>
            <span
              class="invalid-feedback fw-bold mt-0"
              *ngIf="(f.type?.touched || submitted) && f.type?.invalid"
              >Required</span
            >
          </div>
          <div class="col-lg-6 col-md-12 my-1">
            <label for="amount">Amount</label>
            <div class="input-group input-group-sm">
              <input
                type="text"
                class="form-control input-text-right"
                InputMask
                formControlName="amount"
                id="amount"
                placeholder="0.00"
              />
              <span class="input-group-text">SAR</span>
            </div>
          </div>
          <div class="col-lg-6 col-md-12 my-1">
            <label>Rejection Reason</label>
            <ng-select
              [items]="(formData | async)?.RejectionReasons?.content!"
              class="is-invalid"
              bindLabel="name"
              bindValue="name"
              formControlName="rejectionReason"
              placeholder="Rejection Reasons"
              [loading]="formData ? false : true"
            >
              <ng-template ng-option-tmp let-item="item">
                <div>{{ item.name }}</div>
              </ng-template>
            </ng-select>
          </div>
          <div class="col-lg-6 col-md-12 my-1">
            <label for="rejectionNote">Notes</label>
            <input
              type="text"
              class="form-control form-control-sm"
              formControlName="rejectionNote"
              id="rejectionNote"
              placeholder="Notes"
            />
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
export class ClaimRejectDeductFormComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup<IClaimRejectDeductForm>;
  formData!: Observable<IBaseMasterTable>;
  @Input() data: IClaimRejectDeduct = {
    sNo: 0,
    claimSNo: 0,
    clientNo: 0,
    clientName: "",
    amount: 0,
    rejectionNote: "",
    rejectionReason: "",
    type: "",
  };

  @Input() formEditMode: boolean = false;
  @Input() underProcessing: number = 0;
  @Input() claimAmount: number = 0;
  @Output() rejectDeductItem: EventEmitter<IClaimRejectDeduct[]> =
    new EventEmitter<IClaimRejectDeduct[]>();

  types: string[] = [RejectDeduct.Rejected, RejectDeduct.Deducted];

  submitted: boolean = false;
  editMode: boolean = false;
  isLoading: boolean = false;
  subscribes: Subscription[] = [];

  constructor(
    public modal: NgbActiveModal,
    private message: MessagesService,
    private tables: MasterTableService,
    private claimService: ClaimsService
  ) {}

  initForm(): void {
    this.formGroup = new FormGroup<IClaimRejectDeductForm>({
      sNo: new FormControl(null),
      claimSNo: new FormControl(null),
      clientNo: new FormControl(null),
      type: new FormControl(null, Validators.required),
      clientName: new FormControl(null),
      amount: new FormControl(null),
      rejectionNote: new FormControl(null),
      rejectionReason: new FormControl(null),
    });
  }

  get f(): IClaimRejectDeductForm {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.initForm();
    this.formData = this.tables.getBaseData(MODULES.Claims);
    this.formGroup.patchValue({
      claimSNo: this.data.claimSNo,
      clientName: this.data.clientName,
      clientNo: this.data.clientNo,
    });
  }

  validationChecker(): boolean {
    if (this.formEditMode) {
      if (
        +this.claimAmount - +this.underProcessing + +this.f.amount?.value! >
        this.claimAmount
      ) {
        this.message.popup(
          "Attention!",
          "Claim Amount is less than under processing amount",
          "warning"
        );
        return false;
      }
    }
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

  onSubmit(): void {
    this.submitted = true;
    if (!this.validationChecker()) return;
    let value = [
      {
        type: this.f.type?.value!,
        amount: this.f.amount?.value!,
        rejectionNote: this.f.rejectionNote?.value!,
        rejectionReason: this.f.rejectionReason?.value!,
        clientName: this.f.clientName?.value!,
        clientNo: this.f.clientNo?.value!,
      },
    ];
    if (this.formEditMode) {
      this.isLoading = true;
      const formData = new FormData();

      formData.append("ClaimSNo", this.f.claimSNo?.value!.toString()! ?? "");
      formData.append("ClientNo", this.f.clientNo?.value!.toString()! ?? "");
      formData.append("ClientName", this.data.clientName! ?? "");
      formData.append("Type", this.f.type?.value! ?? "");
      formData.append("Amount", this.f.amount?.value!.toString() ?? "0");
      formData.append("RejectionReason", this.f.rejectionReason?.value! ?? "");
      formData.append("RejectionNote", this.f.rejectionNote?.value! ?? "");
      formData.append(
        "UnderProcessing",
        this.underProcessing ? this.underProcessing.toString() : "0"
      );

      this.claimService
        .saveClaimRejectDeduct(formData)
        .subscribe((res: IBaseResponse<IClaimRejectDeduct[]>) => {
          if (res.status) {
            this.message.toast(res.message!, "success");
            this.rejectDeductItem.emit(res.data);
            this.modal.close();
          } else this.message.popup("Oops!", res.message!, "warning");
          this.isLoading = false;
        });
    } else {
      this.rejectDeductItem.emit(value);
      this.modal.close();
    }
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
