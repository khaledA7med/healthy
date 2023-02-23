import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import {
  IClaimInvoice,
  IClaimInvoiceForm,
} from "src/app/shared/app/models/Claims/iclaim-invoice-form";

@Component({
  selector: "app-claim-invoices-form",
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit(formGroup.value)">
      <div class="modal-header">
        <h4 class="modal-title" id="modal-basic-title">Invoice Details</h4>
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
              <label for="others">Others</label>
              <div class="input-group input-group-sm">
                <input
                  type="text"
                  class="form-control input-text-right"
                  InputMask
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
                [required]="false"
                [submitted]="submitted"
                (dateChange)="invoiceDateEvt($event)"
              ></app-gregorian-picker>
            </div>
            <div class="my-1">
              <label for="invoiceNo">Invoice No.</label>
              <input
                type="text"
                class="form-control form-control-sm"
                formControlName="invoiceNo"
                id="invoiceNo"
                placeholder="Invoice No."
              />
            </div>
          </div>
          <div class="col-lg-6 col-md-12">
            <div class="my-1">
              <label for="WIPNo">WIP No.</label>
              <input
                type="text"
                class="form-control form-control-sm"
                formControlName="WIPNo"
                id="WIPNo"
                placeholder="WIP No."
              />
            </div>
            <div class="my-1">
              <label for="chassisNo">Chassis No.</label>
              <input
                type="text"
                class="form-control form-control-sm"
                formControlName="chassisNo"
                id="chassisNo"
                placeholder="Chassis No."
              />
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
    VATInvoicesAmount: 0,
    WIPNo: "",
  };
  submitted: boolean = false;
  editMode: boolean = false;

  subscribes: Subscription[] = [];

  constructor(public modal: NgbActiveModal) {}

  get f(): IClaimInvoiceForm {
    return this.formGroup.controls;
  }

  ngOnInit(): void {}

  invoiceDateEvt(e: any) {}

  onSubmit(value: any): void {}

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
