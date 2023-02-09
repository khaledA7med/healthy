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
import { EventService } from "src/app/core/services/event.service";
import { IPolicyPaymentsListForms } from "src/app/shared/app/models/Production/ipolicy-payments";
import { IProductionForms } from "src/app/shared/app/models/Production/iproduction-forms";
import {
  issueType,
  searchBy,
} from "src/app/shared/app/models/Production/production-util";
import AppUtils from "src/app/shared/app/util";
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
    private appUtils: AppUtils
  ) {}

  ngOnInit(): void {
    this.initForm();
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
      fees: new FormControl(null),
      deductFees: new FormControl({ value: false, disabled: true }),
      vatPerc: new FormControl(null),
      vatValue: new FormControl(null),
      totalPremium: new FormControl(null),
      compCommPerc: new FormControl(null),
      compCommAmount: new FormControl(null),
      compCommVAT: new FormControl(null),
      paymentTermsList: new FormArray<FormGroup<IPolicyPaymentsListForms>>([]),
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
    this.f.periodTo?.patchValue(e.gon);
  }

  inceptionDate(e: any) {
    this.f.periodFrom?.patchValue(e.gon);
    e.gon = {
      day: e.gon.day - 1,
      month: e.gon.month,
      year: e.gon.year + 1,
    };
    this.f.periodTo?.patchValue(e.gon);
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

  //#region Payment Terms
  addPaymentTerm(data?: IPolicyPaymentsListForms) {
    if (this.f.paymentTermsList?.invalid) {
      this.f.paymentTermsList.markAllAsTouched();
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
    this.f.paymentTermsList?.controls.forEach((el) => {
      console.log(el.controls.vatAmount);
      el.controls.percentage?.valueChanges.subscribe((elm) => {
        if (+elm! > 100) el.controls.percentage?.patchValue(100);
        el.controls.amount?.patchValue(
          +this.f.netPremium?.value! * (+elm! / 100)
        );
      });
      // el.controls.percentage?.valueChanges.subscribe((elm) => {
      //   if (+elm! > 100) el.controls.percentage?.patchValue(100);
      //   el.controls.amount?.patchValue(
      //     +this.f.netPremium?.value! * (+elm! / 100)
      //   );
      // });
    });
    this.paymentTermsArrayControls.valueChanges.subscribe((el) => {
      // console.log(el);
      const handler = {
        emitEvent: false,
        OnlySelf: true,
      };
      console.log(this.f.netPremium?.value);
      for (let i = 0; i < el.length; i++) {
        // this.paymentsControls(i, "amount")?.patchValue(
        //   +this.f.netPremium?.value! * (+el[i].percentage / 100),
        //   handler
        // );
        // this.paymentsControls(i, "policyFees")?.patchValue(
        //   +this.f.fees?.value! * (+el[i].percentage / 100),
        //   handler
        // );
        // this.paymentsControls(i, "vatAmount")?.patchValue(
        //   +this.f.vatValue?.value! * (+el[i].percentage / 100),
        //   handler
        // );
        this.paymentsControls(i, "rowTotal")?.patchValue(
          +el[i].amount + +el[i].vatAmount + +el[i].policyFees,
          handler
        );
        console.log(+el[i].amount + +el[i].vatAmount + +el[i].policyFees);
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
      };
    });
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
