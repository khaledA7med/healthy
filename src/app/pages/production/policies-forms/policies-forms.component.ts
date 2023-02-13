import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import {
  IPolicyCommissionListForms,
  IPolicyPaymentsListForms,
} from "src/app/shared/app/models/Production/ipolicy-payments";
import { IProductionForms } from "src/app/shared/app/models/Production/iproduction-forms";
import {
  issueType,
  searchBy,
} from "src/app/shared/app/models/Production/production-util";
import AppUtils from "src/app/shared/app/util";
import { MessagesService } from "src/app/shared/services/messages.service";
import { PolicyRequestsListComponent } from "./policy-requests-list.component";

@Component({
  selector: "app-policies-forms",
  templateUrl: "./policies-forms.component.html",
  styleUrls: ["./policies-forms.component.scss"],
  providers: [AppUtils],
})
export class PoliciesFormsComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup<IProductionForms>;
  formData!: Observable<IBaseMasterTable>;
  submitted: boolean = false;
  uiState = {
    editMode: false,
    editId: "",
    policy: {
      searching: searchBy,
      issueType: issueType,
    },
    requestSearch: {
      clientName: "",
      dateFrom: "",
      dateTo: "",
    },
    clientSearch: {
      clientName: "",
      clientID: "",
    },
    policySearch: {
      clientName: "",
      clientID: "",
      status: "active",
    },
    paymentTermsTotals: {
      percentage: 0,
      netPremium: 0,
      fees: 0,
      vat: 0,
      total: 0,
    },
    paymentTermHandler: {
      fees: 0,
      vat: 0,
      totalPerc: 100,
    },
  };

  docs: any[] = [];
  @ViewChild("dropzone") dropzone!: any;
  @ViewChild(PolicyRequestsListComponent)
  dataSource!: PolicyRequestsListComponent;
  subscribes: Subscription[] = [];
  constructor(
    private modalService: NgbModal,
    private eventService: EventService,
    private appUtils: AppUtils,
    private tables: MasterTableService,
    private message: MessagesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.formData = this.tables.getBaseData(MODULES.ProductionForm);
    this.vatCalcHandlers();
  }

  initForm(): void {
    this.formGroup = new FormGroup<IProductionForms>({
      sNo: new FormControl(null),
      searchType: new FormControl(this.uiState.policy.searching.client),
      producer: new FormControl(null, Validators.required),
      chPolicyHolder: new FormControl(false),
      policyHolder: new FormControl({ value: null, disabled: true }),
      requestNo: new FormControl(null),
      clientInfo: new FormControl(null, Validators.required),
      clientNo: new FormControl(null, Validators.required),
      clientName: new FormControl(null, Validators.required),
      issueType: new FormControl(this.uiState.policy.issueType.new),
      oasisPolRef: new FormControl(null),
      accNo: new FormControl(null, Validators.required),
      policyNo: new FormControl(null, Validators.required),
      endorsType: new FormControl({ value: null, disabled: true }),
      endorsNo: new FormControl({ value: null, disabled: true }),
      insurComp: new FormControl(null, Validators.required),
      className: new FormControl(null, Validators.required),
      lineOfBusiness: new FormControl(null, Validators.required),
      minDriverAge: new FormControl({ value: null, disabled: true }),
      issueDate: new FormControl(null, Validators.required),
      periodFrom: new FormControl(null, Validators.required),
      periodTo: new FormControl(null, Validators.required),
      claimNoOfDays: new FormControl(null),
      csNoOfDays: new FormControl(null),
      remarks: new FormControl(null),
      paymentType: new FormControl({
        value: "Direct to Insurance Company",
        disabled: true,
      }),
      clientDNCNNo: new FormControl(null, Validators.required),
      compCommDNCNNo: new FormControl(null, Validators.required),
      sumInsur: new FormControl(null),
      netPremium: new FormControl(null),
      fees: new FormControl(null, [Validators.max(1000)]),
      deductFees: new FormControl({ value: false, disabled: true }),
      vatPerc: new FormControl(+reserved.DefaultVATPerc),
      vatValue: new FormControl(null),
      totalPremium: new FormControl(null),
      compCommPerc: new FormControl(null),
      compCommAmount: new FormControl(null),
      compCommVAT: new FormControl(null),
      paymentTermsList: new FormArray<FormGroup<IPolicyPaymentsListForms>>([]),
      producersCommissionsList: new FormArray<
        FormGroup<IPolicyCommissionListForms>
      >([]),
    });
  }

  get f(): IProductionForms {
    return this.formGroup.controls;
  }

  chPolicyHolderEvt(e: Event) {
    let elem = e.target as HTMLInputElement;
    if (elem.checked) {
      this.f.policyHolder?.enable();
      this.f.policyHolder?.setValidators(Validators.required);
    } else {
      this.f.policyHolder?.disable();
      this.f.policyHolder?.clearValidators();
    }
    this.f.chPolicyHolder?.updateValueAndValidity();
  }

  searchByEvt(): void {
    if (this.f.searchType?.value === this.uiState.policy.searching.request)
      this.f.requestNo?.setValidators(Validators.required);
    else this.f.requestNo?.clearValidators();
    this.f.requestNo?.updateValueAndValidity();
  }

  openModal(modal: TemplateRef<NgbModalOptions>) {
    this.modalService.open(modal, {
      centered: true,
      size: "xl",
      backdrop: "static",
    });
  }

  setRange(e: any) {
    this.uiState.requestSearch.dateFrom = this.appUtils.dateFormater(e.from);
    this.uiState.requestSearch.dateTo = this.appUtils.dateFormater(e.to);
  }

  issueDate(e: any) {
    this.f.issueDate?.patchValue(e.gon);
    this.f.periodFrom?.patchValue(e.gon);
    e.gon = {
      day: e.gon.day - 1,
      month: e.gon.month,
      year: e.gon.year + 1,
    };
    if (this.f.periodTo?.enabled) this.f.periodTo?.patchValue(e.gon);
  }

  inceptionDate(e: any) {
    this.f.periodFrom?.patchValue(e.gon);
    e.gon = {
      day: e.gon.day - 1,
      month: e.gon.month,
      year: e.gon.year + 1,
    };
    if (this.f.periodTo?.enabled) this.f.periodTo?.patchValue(e.gon);
  }

  expiryDate(e: any) {
    this.f.periodTo?.patchValue(e.gon);
  }

  fillRequestDataToForm(e: any) {
    console.log(e);
  }

  fillClientDataToForm(e: any) {
    console.log(e);
  }

  fillPolicyDataToForm(e: any) {
    console.log(e);
  }

  //#region Policy Details Handlers
  setValidatorAndUpdate(controls: FormControl[]) {
    controls.map((el) => {
      el.setValidators(Validators.required);
      el.updateValueAndValidity();
    });
  }

  removeValidatorAndUpdate(controls: FormControl[]) {
    controls.map((el) => {
      el.clearValidators();
      el.updateValueAndValidity();
    });
  }

  issueTypeToggler(e: Event) {
    let elem = this.f.issueType?.value;
    switch (elem) {
      case this.uiState.policy.issueType.new:
        this.newIssue();
        break;
      case this.uiState.policy.issueType.renewal:
        this.renewalIssue();
        break;
      case this.uiState.policy.issueType.endorsement:
        this.endorsementIssue();
        break;
      default:
        break;
    }
  }
  // Issue Types
  newIssue(): void {
    this.f.accNo?.enable();
    this.f.policyNo?.enable();

    this.f.endorsType?.reset();
    this.f.endorsType?.disable();
    this.f.endorsNo?.reset();
    this.f.endorsNo?.disable();
    this.f.insurComp?.enable();
    this.f.className?.enable();
    this.f.lineOfBusiness?.enable();
    this.f.issueDate?.enable();
    this.f.periodFrom?.enable();
    this.f.periodTo?.enable();
    this.f.compCommPerc?.enable();

    let validators = [
      this.f.endorsType!,
      this.f.endorsNo!,
      this.f.oasisPolRef!,
    ];
    this.removeValidatorAndUpdate(validators);
  }

  renewalIssue(): void {
    this.f.accNo?.enable();
    this.f.policyNo?.enable();

    this.f.endorsType?.reset();
    this.f.endorsType?.disable();

    this.f.endorsNo?.reset();
    this.f.endorsNo?.disable();

    this.f.insurComp?.enable();
    this.f.className?.enable();
    this.f.lineOfBusiness?.enable();
    this.f.periodFrom?.enable();
    this.f.periodTo?.enable();
    this.f.compCommPerc?.enable();

    this.setValidatorAndUpdate([this.f.oasisPolRef!]);
    this.removeValidatorAndUpdate([this.f.endorsType!, this.f.endorsNo!]);
  }

  endorsementIssue(): void {
    this.f.accNo?.reset();
    this.f.accNo?.disable();
    this.f.policyNo?.reset();
    this.f.policyNo?.disable();

    this.f.endorsNo?.enable();
    this.f.endorsType?.enable();

    this.f.insurComp?.disable();
    this.f.insurComp?.reset();

    this.f.className?.disable();
    this.f.className?.reset();

    this.f.lineOfBusiness?.disable();
    this.f.lineOfBusiness?.reset();

    this.f.issueDate?.enable();
    this.f.periodFrom?.enable();

    this.f.periodTo?.disable();
    this.f.periodTo?.reset();

    this.f.compCommPerc?.disable();
    this.f.compCommPerc?.reset();

    this.setValidatorAndUpdate([
      this.f.oasisPolRef!,
      this.f.endorsNo!,
      this.f.endorsType!,
    ]);
  }

  endorsTypeTogglerEvt(e: any) {
    switch (e) {
      case "Extension":
        this.f.deductFees?.enable();
        this.f.paymentTermsList?.enable();
        break;
      case "Refund":
        this.f.deductFees?.enable();
        this.f.paymentTermsList?.clear();
        this.f.paymentTermsList?.disable();
        break;
      default:
        this.f.deductFees?.disable();
        this.f.deductFees?.reset();
        this.f.paymentTermsList?.enable();
        break;
    }
    this.vatHandler();
  }

  //#endregion

  //#region Invoices Details
  formListeners(e?: Event): void {
    this.vatHandler();
    if (+this.f.compCommPerc?.value! > 0) {
      if (+this.f.compCommPerc?.value! > 100) {
        this.f.compCommPerc?.patchValue(100);
        return;
      }
      this.f.compCommAmount?.patchValue(
        +this.f.netPremium?.value! * (+this.f.compCommPerc?.value! / 100)
      );
      this.f.compCommVAT?.patchValue(
        +this.f.compCommAmount?.value! * (this.f.vatPerc?.value! / 100)
      );
      this.f.producerComm?.patchValue(
        this.f.compCommAmount?.value! * (this.f.producerCommPerc?.value! / 100)
      );
      if (+this.f.producerCommPerc?.value! > 0) {
        this.f.producerComm?.patchValue(
          +this.f.compCommAmount?.value! *
            (this.f.producerCommPerc?.value! / 100)
        );
      }
    }
    this.totalPaymentRow();
  }
  vatHandler(): void {
    if (this.f.endorsType?.value === "Refund" && !this.f.deductFees?.value) {
      this.f.vatValue?.patchValue(
        +this.f.netPremium?.value! -
          (+this.f.fees?.value! * +this.f.vatPerc?.value!) / 100
      );
      this.f.totalPremium?.patchValue(
        +this.f.netPremium?.value! -
          +this.f.fees?.value! +
          +this.f.vatValue?.value!
      );
    } else {
      this.f.vatValue?.patchValue(
        (+this.f.netPremium?.value! + +this.f.fees?.value!) *
          (this.f.vatPerc?.value! / 100)
      );
      this.f.totalPremium?.patchValue(
        +this.f.netPremium?.value! +
          +this.f.fees?.value! +
          +this.f.vatValue?.value!
      );
    }

    if (+this.f.compCommPerc?.value! > 0)
      this.f.compCommVAT?.patchValue(
        +this.f.compCommAmount?.value! * (this.f.vatPerc?.value! / 100)
      );
  }

  vatCalcHandlers(): void {
    let sub = this.f.vatValue?.valueChanges.subscribe(() => {
      if (this.f.paymentTermsList?.length) {
        for (let i = 0; i < this.paymentTermsArrayControls.length; i++) {
          let vat = this.paymentsControls(i, "vatAmount");
          vat?.patchValue(0);
        }
      }
    });
    this.subscribes.push(sub!);
  }
  //#endregion

  //#region Payment Terms
  addPaymentTerm(data?: IPolicyPaymentsListForms) {
    if (this.f.paymentTermsList?.invalid) {
      this.f.paymentTermsList.markAllAsTouched();
      return;
    }
    if (!this.f.netPremium?.value!) {
      this.message.popup("Oo !", "Please fill Invoices Details", "warning");
      return;
    }

    let payment = new FormGroup<IPolicyPaymentsListForms>({
      payDate: new FormControl(data?.payDate || null, Validators.required),
      amount: new FormControl(data?.amount || null),
      percentage: new FormControl(data?.percentage || null, [
        Validators.max(100),
        Validators.min(0),
      ]),
      policyFees: new FormControl(data?.policyFees || null),
      vatAmount: new FormControl(data?.vatAmount || null),
      rowTotal: new FormControl(null),
    });
    if (!data) payment.reset();
    else payment.disable();

    this.f.paymentTermsList?.push(payment);
    this.paymentTermsArrayControls.updateValueAndValidity();
    this.totalPaymentRow();
  }

  get paymentTermsArrayControls(): FormArray {
    return this.formGroup.get("paymentTermsList") as FormArray;
  }

  paymentsControls(i: number, control: string): AbstractControl {
    return this.paymentTermsArrayControls.controls[i].get(control)!;
  }
  paymentTermDates(e: any, i: any) {
    this.paymentsControls(i, "payDate").patchValue(e.gon);
  }

  totalPaymentRow() {
    const handler = {
      emitEvent: false,
      OnlySelf: true,
    };
    this.paymentRecalcEvtHandler();

    this.f.paymentTermsList?.controls.forEach((el) => {
      let sub1 = el.controls.percentage?.valueChanges.subscribe((elm) => {
        if (+elm! > this.uiState.paymentTermHandler.totalPerc)
          el.controls.percentage?.patchValue(
            this.uiState.paymentTermHandler.totalPerc,
            handler
          );
        el.controls.amount?.patchValue(
          +this.f.netPremium?.value! * (+el.controls.percentage?.value! / 100)
        );
        el.controls.policyFees?.patchValue(
          +this.f.fees?.value! * (+el.controls.percentage?.value! / 100)
        );
        el.controls.vatAmount?.patchValue(
          +this.f.vatValue?.value! * (+el.controls.percentage?.value! / 100)
        );
        if (
          +el.controls.policyFees?.value! >=
          +this.uiState.paymentTermHandler.fees
        ) {
          el.controls.policyFees?.patchValue(
            +this.uiState.paymentTermHandler.fees
          );
        }

        if (
          +el.controls.vatAmount?.value! >= +this.uiState.paymentTermHandler.vat
        ) {
          el.controls.vatAmount?.patchValue(
            +this.uiState.paymentTermHandler.vat
          );
        }
      });
      this.subscribes.push(sub1!);
    });
    let sub = this.paymentTermsArrayControls.valueChanges.subscribe((el) => {
      for (let i = 0; i < el.length; i++) {
        this.paymentsControls(i, "rowTotal")?.patchValue(
          +el[i].amount + +el[i].vatAmount + +el[i].policyFees,
          handler
        );
      }
      this.uiState.paymentTermsTotals = {
        percentage: el.reduce(
          (prev: any, next: any) => +prev + +next.percentage,
          0
        ),
        netPremium: el.reduce(
          (prev: any, next: any) => +prev + +next.amount,
          0
        ),
        fees: el.reduce((prev: any, next: any) => +prev + +next.policyFees, 0),
        vat: el.reduce((prev: any, next: any) => +prev + +next.vatAmount, 0),
        total: el.reduce(
          (prev: any, next: any) =>
            +prev + +next.amount + +next.policyFees + +next.vatAmount,
          0
        ),
      };
    });
    this.subscribes.push(sub);
  }

  paymentTermsHandler(): void {
    if (this.f.paymentTermsList?.length) {
      for (let i = 0; i < this.paymentTermsArrayControls.length; i++) {
        let perc = this.paymentsControls(i, "percentage").value,
          net = this.paymentsControls(i, "amount");
        net.patchValue(this.f.netPremium?.value! * (perc / 100));
      }
    }
  }

  paymentTermsValueHandler(i: number, con: string, e: Event) {
    let elm = (e.target as HTMLInputElement).value,
      val!: any;
    if (con === "policyFees") val = +this.f.fees?.value!;
    else if (con === "vatAmount") val = +this.f.vatValue?.value!;
    if (+elm.replace(/,/g, "") > +val) {
      this.paymentsControls(i, con).patchValue(val);
      return;
    }
  }

  paymentRecalcEvtHandler(): void {
    this.uiState.paymentTermHandler.totalPerc =
      100 - +this.uiState.paymentTermsTotals.percentage;
    this.uiState.paymentTermHandler.fees =
      +this.f.fees?.value! - +this.uiState.paymentTermsTotals.fees;
    this.uiState.paymentTermHandler.vat =
      +this.f.vatValue?.value! - +this.uiState.paymentTermsTotals.vat;
  }

  get paymentTermsListBool(): boolean {
    return (
      this.f.endorsType?.value === "Refund" ||
      (this.f.fees?.value! === this.uiState.paymentTermsTotals.fees &&
        this.f.vatValue?.value! === this.uiState.paymentTermsTotals.vat &&
        this.uiState.paymentTermsTotals.percentage === 100)
    );
  }

  removePayment(i: number) {
    this.uiState.paymentTermHandler.totalPerc += this.paymentsControls(
      i,
      "percentage"
    ).value;
    this.uiState.paymentTermHandler.fees += this.paymentsControls(
      i,
      "policyFees"
    ).value;
    this.uiState.paymentTermHandler.vat += this.paymentsControls(
      i,
      "vatAmount"
    ).value;
    this.paymentTermsArrayControls.removeAt(i);
  }
  //#endregion

  documentsList(e: any) {}

  onSubmit(e: any) {
    this.submitted = true;
  }

  resetForm() {}

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
