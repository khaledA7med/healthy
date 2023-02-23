import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import {
  IClaimApproval,
  IClaimApprovalForm,
} from "src/app/shared/app/models/Claims/iclaim-approval-form";

@Component({
  selector: "app-claim-approvals-form",
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit(formGroup.value)">
      <div class="modal-header">
        <h4 class="modal-title" id="modal-basic-title">Approval Details</h4>
        <button
          type="button"
          class="btn-close btn-sm"
          aria-label="Close"
          (click)="modal.dismiss()"
        ></button>
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
              <input
                type="text"
                class="form-control form-control-sm"
                formControlName="chassisNo"
                id="chassisNo"
                placeholder="Chassis/Item No."
              />
            </div>
            <div class="my-1">
              <label for="dateofPayment">Date Of Payments</label>
              <app-gregorian-picker
                [model]="f.approvalDate.value"
                [required]="false"
                [submitted]="submitted"
                (dateChange)="approvalDateEvt($event)"
              ></app-gregorian-picker>
            </div>
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
export class ClaimApprovalsFormComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup<IClaimApprovalForm>;
  formData!: IBaseMasterTable;
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
    VATAmount: 0,
    discounts: 0,
    approvalDate: new Date(),
  };

  submitted: boolean = false;
  editMode: boolean = false;
  subscribes: Subscription[] = [];
  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
    this.initForm();
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
      approvalDate: new FormControl(null),
    });
  }

  get f(): IClaimApprovalForm {
    return this.formGroup.controls;
  }

  approvalDateEvt(evt: any) {}

  onSubmit(value: any) {}

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
