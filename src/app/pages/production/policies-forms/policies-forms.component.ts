import { HttpResponse } from "@angular/common/http";
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
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import {
  Caching,
  IBaseMasterTable,
  IGenericResponseType,
} from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IPaymentTermsList } from "src/app/shared/app/models/Production/ipayment-terms-list";
import {
  IPolicyCommissionListForms,
  IPolicyPaymentsListForms,
} from "src/app/shared/app/models/Production/ipolicy-payments";
import { IPolicyPreview } from "src/app/shared/app/models/Production/ipolicy-preview";
import { IProducersCommissionsList } from "src/app/shared/app/models/Production/iproducers-commissions-list";
import { IProductionForms } from "src/app/shared/app/models/Production/iproduction-forms";
import {
  IPoliciesRef,
  IPolicyClient,
  IPolicyRequestResponse,
  IPolicyRequests,
  issueType,
  searchBy,
} from "src/app/shared/app/models/Production/production-util";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import AppUtils from "src/app/shared/app/util";
import { DropzoneComponent } from "src/app/shared/components/dropzone/dropzone/dropzone.component";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";
import { SweetAlertResult } from "sweetalert2";
import { PolicyRequestsListComponent } from "./policy-requests-list.component";

@Component({
  selector: "app-policies-forms",
  templateUrl: "./policies-forms.component.html",
  styleUrls: ["./policies-forms.component.scss"],
})
export class PoliciesFormsComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup<IProductionForms>;
  formData!: Observable<IBaseMasterTable>;

  modalRef!: NgbModalRef;

  uiState = {
    editMode: false,
    editId: "",
    date: new Date(),
    submitted: false as boolean,
    policy: {
      searching: searchBy,
      issueType: issueType,
      lineOfBusiness: [] as IGenericResponseType[],
      isRequest: false as boolean,
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
    producerCommission: {
      producers: [] as any,
      commissionTotals: {
        percentage: 0,
        amount: 0,
      },
    },
  };

  documentsToUpload: File[] = [];
  docs: any[] = [];
  @ViewChild(DropzoneComponent) dropzone!: DropzoneComponent;
  @ViewChild(PolicyRequestsListComponent)
  dataSource!: PolicyRequestsListComponent;
  subscribes: Subscription[] = [];
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private tables: MasterTableService,
    private productionService: ProductionService,
    private methods: MasterMethodsService,
    private eventService: EventService,
    private appUtils: AppUtils,
    private message: MessagesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.formDataHandler();
    this.calcHandlers();
    let sub = this.route.paramMap.subscribe((res) => {
      if (res.get("id")) {
        this.uiState.editId = res.get("id")!;
        this.eventService.broadcast(reserved.isLoading, true);
        this.getPolicy(this.uiState.editId);
      } else if (res.get("invoice") && res.get("serial") && res.get("reqno")) {
        this.uiState.editMode = true;
        this.eventService.broadcast(reserved.isLoading, true);
        let invoice = atob(res.get("invoice")!),
          serial = atob(res.get("serial")!),
          reqNo = atob(res.get("reqno")!);
        this.f.searchType?.patchValue(this.uiState.policy.searching.request);
        this.searchByEvt();
        let data: IPolicyRequests = {
          policySerial: invoice,
          clientPolicySNo: serial,
          requestNo: reqNo,
        };
        this.fillRequestDataToForm(data);
      }
    });
    this.subscribes.push(sub);
  }

  formDataHandler(): void {
    this.formData = this.tables.getBaseData(MODULES.ProductionForm);
    let sub = this.formData.subscribe((res) => {
      this.uiState.producerCommission.producers = res.Producers?.content.filter(
        (el) => !el.name.startsWith("Direct Business")
      );
    });

    let sub2 = this.f.chPolicyHolder?.valueChanges.subscribe((el) => {
      if (el) this.f.policyHolder?.enable();
      else this.f.policyHolder?.disable();
    });

    this.subscribes.push(sub, sub2!);

    let date = {
      gon: {
        year: this.uiState.date.getFullYear(),
        month: this.uiState.date.getMonth() + 1,
        day: this.uiState.date.getDate(),
      },
    };
    this.issueDate(date);
  }

  initForm(): void {
    this.formGroup = new FormGroup<IProductionForms>({
      sNo: new FormControl(null),
      searchType: new FormControl(this.uiState.policy.searching.client),
      producer: new FormControl(null, Validators.required),
      chPolicyHolder: new FormControl(false),
      policyHolder: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
      requestNo: new FormControl(null),
      clientInfo: new FormControl(null, Validators.required),
      clientNo: new FormControl(null, Validators.required),
      clientName: new FormControl(null, Validators.required),
      issueType: new FormControl(this.uiState.policy.issueType.new),
      oasisPolRef: new FormControl(null),
      accNo: new FormControl(null, Validators.required),
      policyNo: new FormControl(null, Validators.required),
      endorsType: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
      endorsNo: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
      insurComp: new FormControl(null, Validators.required),
      className: new FormControl(null, Validators.required),
      lineOfBusiness: new FormControl(null, Validators.required),
      minDriverAge: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
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
      sumInsur: new FormControl(0),
      netPremium: new FormControl(0),
      fees: new FormControl(0, [Validators.max(1000)]),
      deductFees: new FormControl({ value: false, disabled: true }),
      vatPerc: new FormControl(+reserved.DefaultVATPerc),
      vatValue: new FormControl(0),
      totalPremium: new FormControl(0),
      compCommPerc: new FormControl(0),
      compCommAmount: new FormControl(0),
      compCommVAT: new FormControl(0),
      producerCommPerc: new FormControl(0),
      producerComm: new FormControl(0),
      paymentTermsList: new FormArray<FormGroup<IPolicyPaymentsListForms>>([]),
      producersCommissionsList: new FormArray<
        FormGroup<IPolicyCommissionListForms>
      >([]),
    });
  }

  get f(): IProductionForms {
    return this.formGroup.controls;
  }

  searchByEvt(): void {
    if (this.f.searchType?.value === this.uiState.policy.searching.request)
      this.f.requestNo?.setValidators(Validators.required);
    else {
      this.resetForm();
      this.f.searchType?.patchValue("Client");
      this.f.issueType?.patchValue("new");
      this.f.requestNo?.clearValidators();
      this.uiState.policy.isRequest = false;
      this.newIssue();
    }
    this.f.requestNo?.updateValueAndValidity();
  }

  openModal(modal: TemplateRef<NgbModalOptions>) {
    this.modalRef = this.modalService.open(modal, {
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

  fillRequestDataToForm(e: IPolicyRequests) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.productionService
      .fillRequestData(e.policySerial!, e.clientPolicySNo!)
      .subscribe((res: IBaseResponse<IPolicyRequestResponse>) => {
        if (res.status) {
          this.endorsementIssue();
          let client = res.data?.clientData,
            policy = res.data?.clientPolicy;
          let data: IPolicyPreview = {
            accNo: policy?.accNo,
            className: policy?.className,
            compCommPerc: +policy?.compCommPerc!,
            insurComp: policy?.insurComp,
            lineOfBusiness: policy?.lineOfBusiness,
            issueDate: client?.issueDate,
            periodFrom: client?.periodFrom,
            periodTo: new Date(policy?.periodTo!),
            policyNo: policy?.policyNo,
            producerCommPerc: +policy?.producerCommPerc!,
            clientNo: +client?.clientNo!,
            clientName: client?.clientName,
            producer: client?.producer,
            oasisPolRef: client?.oasisPolRef,
            endorsType: client?.endorsType,
            endorsNo: client?.endorsNo,
            minDriverAge: +client?.minDriverAge!,
            claimNoOfDays: +client?.claimNoOfDays!,
            csnoOfDays: +client?.csNoOfDays!,
            remarks: client?.remarks,
          };

          this.setPolicyDataToForm(data);
          this.f.issueType?.patchValue("endorsement");
          this.f.requestNo?.patchValue(e.requestNo!);
          this.uiState.policy.isRequest = true;
          this.uiState.policySearch.clientName = client?.clientName!;
          this.uiState.policySearch.clientID = client?.clientNo!;

          if (!this.uiState.editMode) this.modalRef.close();
        } else this.message.popup("Oops!", res.message!, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      });
    this.subscribes.push(sub);
  }

  fillClientDataToForm(e: IPolicyClient) {
    this.formGroup.patchValue({
      clientInfo: `${e.sNo} | ${e.fullName}`,
      clientName: e.fullName,
      clientNo: e.sNo,
      producer: e.producer,
    });
    this.uiState.policySearch.clientName = e.fullName!;
    this.uiState.policySearch.clientID = e.sNo!;
    this.uiState.policy.isRequest = false;
    this.modalRef.close();
  }
  fillPolicyDataToForm(e: IPoliciesRef) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.productionService
      .loadPolicyData(e.policiesSNo, e.sNo)
      .subscribe((res: IBaseResponse<IPolicyPreview>) => {
        if (res.status) {
          let data = res.data;
          this.setPolicyDataToForm(data!);
          this.uiState.policy.isRequest = false;
          this.modalRef.close();
        } else this.message.popup("Oops!", res.message!, "warning");
        this.eventService.broadcast(reserved.isLoading, false);
      });
    this.subscribes.push(sub);
  }

  getPolicy(id: string): void {
    this.uiState.editMode = true;
    this.productionService
      .getPolicy(id)
      .subscribe((res: HttpResponse<IBaseResponse<IPolicyPreview>>) => {
        if (res.body?.status) {
          let data = res.body?.data!;
          this.formGroup.patchValue({
            sNo: data.sNo,
            sumInsur: data.sumInsur,
            netPremium: data.netPremium,
            fees: data.fees,
            deductFees: data.deductFees,
            vatPerc: data.vatPerc,
            vatValue: data.vatValue,
            totalPremium: data.totalPremium,
            compCommAmount: data.compComm,
            compCommVAT: data.compCommVAT,
            producerComm: data.producerComm,
          });
          this.setPolicyDataToForm(data);
        } else this.message.popup("Oops!", res.body?.message!, "warning");
        this.eventService.broadcast(reserved.isLoading, false);
      });
  }

  setPolicyDataToForm(data: IPolicyPreview): void {
    this.formGroup.patchValue({
      clientInfo: `${data.clientNo} | ${data.clientName}`,
      clientName: data.clientName,
      clientNo: data.clientNo?.toString(),
      producer: data.producer,
      chPolicyHolder: data.policyHolder ? true : false,
      policyHolder: data.policyHolder,
      oasisPolRef: data.oasisPolRef,
      accNo: data.accNo,
      policyNo: data.policyNo,
      endorsType: data.endorsType !== "Policy" ? data.endorsType : null,
      endorsNo: data.endorsNo,
      insurComp: data.insurComp,
      className: data.className,
      lineOfBusiness: data.lineOfBusiness,
      minDriverAge: data.minDriverAge,
      claimNoOfDays: data.claimNoOfDays,
      csNoOfDays: data.csnoOfDays,
      remarks: data.remarks,
      clientDNCNNo: data.clientDNCNNo,
      compCommDNCNNo: data.compCommDNCNNo,
      compCommPerc: data.compCommPerc,
      producerCommPerc: data.producerCommPerc,
      issueDate: this.appUtils.dateStructFormat(data?.issueDate!) as any,
      periodFrom: this.appUtils.dateStructFormat(data?.periodFrom!) as any,
      periodTo: this.appUtils.dateStructFormat(data?.periodTo!) as any,
    });

    this.getLineOfBusiness(data.className!, true);
    this.totalPaymentRow();
    this.totalCommissionRow();

    if (data?.producersCommissionsList!)
      data?.producersCommissionsList!.forEach((com) =>
        this.addProducerCommission(com)
      );
    if (data?.paymentTermsList!)
      data?.paymentTermsList!.forEach((pay) => this.addPaymentTerm(pay));
    this.docs = data.documentList!;

    this.eventService.broadcast(reserved.isLoading, false);
  }

  //#region Policy Details Handlers

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

    this.f.oasisPolRef?.disable();
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
    this.f.oasisPolRef?.enable();
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

    this.f.oasisPolRef?.enable();
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

  getLineOfBusiness(cls: string, evt?: boolean) {
    let sub = this.methods
      .getLineOfBusiness(cls)
      .subscribe(
        (res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>) => {
          if (!evt) this.f.lineOfBusiness?.reset();
          this.uiState.policy.lineOfBusiness = res.body?.data?.content!;
        }
      );
    this.subscribes.push(sub);
    if (cls === "Motor") this.f.minDriverAge?.enable();
    else this.f.minDriverAge?.disable();
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
    }
    this.totalPaymentRow();
    this.commissionsValues();
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
        this.appUtils.currencyFormater(
          (+this.f.netPremium?.value! + +this.f.fees?.value!) *
            (this.f.vatPerc?.value! / 100)
        )
      );
      this.f.totalPremium?.patchValue(
        +this.f.netPremium?.value! +
          +this.f.fees?.value! +
          +this.f.vatValue?.value!
      );
    }

    if (+this.f.compCommPerc?.value! > 0)
      this.f.compCommVAT?.patchValue(
        this.appUtils.currencyFormater(
          +this.f.compCommAmount?.value! * (this.f.vatPerc?.value! / 100)
        )
      );
  }

  calcHandlers(): void {
    let sub = this.f.vatValue?.valueChanges.subscribe(() => {
      if (this.f.paymentTermsList?.length) {
        for (let i = 0; i < this.paymentTermsArrayControls.length; i++) {
          let vat = this.paymentsControls(i, "vatAmount");
          vat?.patchValue(0);
        }
      }
    });
    let sub2 = this.f.compCommPerc?.valueChanges.subscribe((el) =>
      this.commissionsValues()
    );
    let sub3 = this.f.producerCommPerc?.valueChanges.subscribe((el) =>
      this.commissionsValues()
    );
    this.subscribes.push(sub!);
    this.subscribes.push(sub2!);
    this.subscribes.push(sub3!);
  }

  commissionsValues(): void {
    this.f.compCommAmount?.patchValue(
      this.appUtils.currencyFormater(
        +this.f.netPremium?.value! * (+this.f.compCommPerc?.value! / 100)
      )
    );
    this.f.compCommVAT?.patchValue(
      this.appUtils.currencyFormater(
        +this.f.compCommAmount?.value! * (this.f.vatPerc?.value! / 100)
      )
    );
    this.f.producerComm?.patchValue(
      this.appUtils.currencyFormater(
        this.f.compCommAmount?.value! * (this.f.producerCommPerc?.value! / 100)
      )
    );
    if (+this.f.producerCommPerc?.value! > 0) {
      this.f.producerComm?.patchValue(
        this.appUtils.currencyFormater(
          +this.f.compCommAmount?.value! *
            (this.f.producerCommPerc?.value! / 100)
        )
      );
      this.commissionHandler();
    }
  }

  producerCommissionsListeners(e?: Event): void {
    let elm = (e?.target as HTMLInputElement).value;
    if (+elm! > 100) {
      this.f.producerCommPerc?.patchValue(100);
      return;
    }
  }
  //#endregion

  //#region Payment Terms
  addPaymentTerm(data?: IPaymentTermsList) {
    if (this.f.paymentTermsList?.invalid) {
      this.f.paymentTermsList.markAllAsTouched();
      return;
    }
    if (!this.f.netPremium?.value!) {
      this.message.popup("Oo !", "Please fill Invoices Details", "warning");
      return;
    }
    let payment = new FormGroup<IPolicyPaymentsListForms>({
      payDate: new FormControl(
        (this.appUtils.dateStructFormat(data?.payDate!) as any) || null,
        Validators.required
      ),
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
          this.appUtils.currencyFormater(
            +this.f.netPremium?.value! * (+el.controls.percentage?.value! / 100)
          )
        );
        el.controls.policyFees?.patchValue(
          this.appUtils.currencyFormater(
            +this.f.fees?.value! * (+el.controls.percentage?.value! / 100)
          )
        );
        el.controls.vatAmount?.patchValue(
          this.appUtils.currencyFormater(
            +this.f.vatValue?.value! * (+el.controls.percentage?.value! / 100)
          )
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
        this.equalizerPaymentTerms();
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
    let len = this.paymentTermsArrayControls.length;
    if (len) {
      for (let i = 0; i < len; i++) {
        let perc = this.paymentsControls(i, "percentage").value,
          net = this.paymentsControls(i, "amount");
        net.patchValue(
          this.appUtils.currencyFormater(
            this.f.netPremium?.value! * (perc / 100)
          )
        );
      }
    }
  }

  paymentTermsValueHandler(i: number, con: string, e: Event) {
    let elm = (e.target as HTMLInputElement).value,
      val!: any;
    if (con === "policyFees") val = +this.f.fees?.value!;
    else if (con === "vatAmount") val = +this.f.vatValue?.value!;
    if (+elm.replace(/,/g, "") > +val) {
      this.paymentsControls(i, con).patchValue(
        this.appUtils.currencyFormater(val)
      );
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

  equalizerPaymentTerms(): void {
    let cls = this.paymentTermsArrayControls,
      net =
        +this.f.netPremium?.value! - this.uiState.paymentTermsTotals.netPremium,
      fees = +this.f.fees?.value! - this.uiState.paymentTermsTotals.fees,
      vat = +this.f.vatValue?.value! - this.uiState.paymentTermsTotals.vat,
      total =
        +this.f.totalPremium?.value! - this.uiState.paymentTermsTotals.total;

    if (net > 0 && net < 1) {
      cls
        .at(-1)
        .get("amount")
        ?.patchValue(+cls.at(-1).get("amount")?.value + +net);
    }
    if (fees > 0 && fees < 1) {
      cls
        .at(-1)
        .get("policyFees")
        ?.patchValue(+cls.at(-1).get("policyFees")?.value + +fees);
    }
    if (net > 0 && net < 1) {
      cls
        .at(-1)
        .get("vatAmount")
        ?.patchValue(+cls.at(-1).get("vatAmount")?.value + +vat);
    }
    if (total > 0 && total < 1) {
      cls
        .at(-1)
        .get("total")
        ?.patchValue(+cls.at(-1).get("total")?.value + +net);
    }
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

  //#region Producer Commissions
  addProducerCommission(data?: IProducersCommissionsList): void {
    if (this.f.producersCommissionsList?.invalid) {
      this.f.producersCommissionsList.markAllAsTouched();
      return;
    }

    let commission = new FormGroup<IPolicyCommissionListForms>({
      producer: new FormControl(data?.producer || null, Validators.required),
      amount: new FormControl(data?.amount || null),
      percentage: new FormControl(data?.percentage || null, [
        Validators.max(100),
        Validators.min(0),
        Validators.required,
      ]),
      rowTotal: new FormControl(null),
    });

    if (!data) commission.reset();
    else commission.disable();

    if (this.f.producersCommissionsList?.length === 0)
      commission.controls.producer?.patchValue(this.f.producer?.value!);

    this.f.producersCommissionsList?.push(commission);
    this.producersCommissionsArrayControls.updateValueAndValidity();
    this.totalCommissionRow();
  }

  get producersCommissionsArrayControls(): FormArray {
    return this.formGroup.get("producersCommissionsList") as FormArray;
  }

  commissionControls(i: number, control: string): AbstractControl {
    return this.producersCommissionsArrayControls.controls[i].get(control)!;
  }

  totalCommissionRow() {
    const handler = {
      emitEvent: false,
      OnlySelf: true,
    };
    this.f.producersCommissionsList?.controls.forEach((el) => {
      let sub1 = el.controls.percentage?.valueChanges.subscribe((elm) => {
        if (+elm! > +this.f.producerCommPerc?.value!)
          el.controls.percentage?.patchValue(
            +this.f.producerCommPerc?.value!,
            handler
          );
        el.controls.amount?.patchValue(
          this.appUtils.currencyFormater(
            +this.f.compCommAmount?.value! *
              (+el.controls.percentage?.value! / 100)
          )
        );
      });
      this.subscribes.push(sub1!);
    });
    let sub = this.producersCommissionsArrayControls.valueChanges.subscribe(
      (el) => {
        this.uiState.producerCommission.commissionTotals = {
          percentage: el.reduce(
            (prev: any, next: any) => +prev + +next.percentage,
            0
          ),
          amount: el.reduce((prev: any, next: any) => +prev + +next.amount, 0),
        };
      }
    );
    this.subscribes.push(sub);
  }

  commissionHandler(): void {
    if (this.f.producersCommissionsList?.length) {
      for (let i = 0; i < this.producersCommissionsArrayControls.length; i++) {
        let perc = this.commissionControls(i, "percentage").value,
          net = this.commissionControls(i, "amount");
        net.patchValue(
          this.appUtils.currencyFormater(
            this.f.producerComm?.value! * (perc / 100)
          )
        );
      }
    }
  }

  get commissionListBool(): boolean {
    return (
      +this.f.producerCommPerc?.value! <= 0 ||
      +this.f.compCommPerc?.value! <= 0 ||
      +this.uiState.producerCommission.commissionTotals.percentage >=
        +this.f.producerCommPerc?.value!
    );
  }

  removeCommission(i: number) {
    this.uiState.producerCommission.commissionTotals.percentage +=
      this.commissionControls(i, "percentage").value;
    this.uiState.producerCommission.commissionTotals.amount +=
      this.commissionControls(i, "amount").value;
    this.producersCommissionsArrayControls.removeAt(i);
  }

  //#endregion
  documentsList(evt: any) {
    this.documentsToUpload = evt;
  }

  //#region

  onSubmit(): void {
    this.uiState.submitted = true;
    if (!this.validationChecker()) return;
    if (!this.financeChecker()) return;
    this.financeValueChecker();
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

  financeChecker(): boolean {
    let totals = this.uiState.paymentTermsTotals,
      coms = this.uiState.producerCommission.commissionTotals,
      values = {
        net: +this.f.netPremium?.value!,
        fees: +this.f.fees?.value!,
        vat: +this.f.vatValue?.value!,
        total: +this.f.totalPremium?.value!,
        producerCom: +this.f.producerComm?.value!,
        producerComPerc: +this.f.producerCommPerc?.value!,
      };

    if (
      totals.fees !== values.fees ||
      totals.netPremium !== values.net ||
      totals.vat !== values.vat
    ) {
      if (
        this.f.endorsType?.value !== "Refund" &&
        this.f.endorsType?.value !== "Cancellation"
      ) {
        this.message.popup(
          "Attention!",
          "Payment Schedule Totals Not Correct!",
          "warning"
        );
        return false;
      }
    }
    if (
      coms.amount !== values.producerCom ||
      coms.percentage !== values.producerComPerc
    ) {
      this.message.popup(
        "Attention!",
        "Producer Commissions Schedule Totals Not Correct!",
        "warning"
      );
      return false;
    }
    return true;
  }

  financeValueChecker(): void {
    let arr = [];
    let msg = "";

    if (+this.f.netPremium?.value! === 0) arr.push("Net Premium Value = 0");
    if (+this.f.compCommAmount?.value! === 0)
      arr.push("Company Commission Value = 0");

    if (arr.length) {
      for (let i = 0; i < arr.length; i++)
        msg += `<li class='text-start'>${arr[i]}</li>`;

      this.message
        .templateComfirmation(
          "Are You Sure Want Countinue ?!",
          `<ul>${msg}</ul>`,
          "Yes, Sure !",
          undefined,
          "question"
        )
        .then((res: SweetAlertResult) => {
          if (res.isConfirmed) this.checkPolicyEndorsNo();
        });
    } else this.checkPolicyEndorsNo();
  }

  checkPolicyEndorsNo(): void {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.productionService
      .checkEndorsNo(this.f.policyNo?.value!, this.f.endorsNo?.value!)
      .subscribe((res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.eventService.broadcast(reserved.isLoading, false);
          this.message
            .templateComfirmation(
              "Attention!",
              res.body.message!,
              "Continue",
              "info",
              "question"
            )
            .then((res: SweetAlertResult) => {
              if (res.isConfirmed) this.sendFormRequestData();
            });
        } else this.sendFormRequestData();
      });
    this.subscribes.push(sub);
  }

  sendFormRequestData(): void {
    // Display Submitting Loader
    this.eventService.broadcast(reserved.isLoading, true);
    const formData = new FormData();

    let val = this.formGroup.getRawValue();

    if (this.uiState.editMode) formData.append("sNo", val.sNo ?? "0");

    formData.append("RequestNo", val.requestNo! ?? "");
    formData.append("ClientNo", val.clientNo!);
    formData.append("ClientName", val.clientName!);
    formData.append("Producer", val.producer!);
    formData.append("PolicyHolder", val.policyHolder! ?? "");
    formData.append("CHPolicyHolder", val.chPolicyHolder?.toString()!);
    formData.append("OasisPolRef", val.oasisPolRef! ?? "");
    formData.append("IssueType", val.issueType!);
    formData.append("AccNo", val.accNo!);
    formData.append("PolicyNo", val.policyNo!);
    formData.append("EndorsType", val.endorsType! ?? "");
    formData.append("EndorsNo", val.endorsNo! ?? "");
    formData.append("InsurComp", val.insurComp! ?? "");
    formData.append("ClassName", val.className! ?? "");
    formData.append("LineOfBusiness", val.lineOfBusiness! ?? "");
    formData.append("MinDriverAge", val.minDriverAge?.toString() ?? "0");

    formData.append("IssueDate", this.appUtils.dateFormater(val.issueDate!));
    formData.append("PeriodTo", this.appUtils.dateFormater(val.periodTo!));
    formData.append("PeriodFrom", this.appUtils.dateFormater(val.periodFrom!));

    formData.append("ClaimNoOfDays", val.claimNoOfDays?.toString()! ?? "0");
    formData.append("CSNoOfDays", val.csNoOfDays?.toString()! ?? "0");
    formData.append("Remarks", val.remarks! ?? "");
    formData.append("SumInsur", val.sumInsur?.toString()! ?? "0");
    formData.append("ClientDNCNNo", val.clientDNCNNo! ?? "");
    formData.append("NetPremium", val.netPremium?.toString()! ?? "0");
    formData.append("Fees", val.fees?.toString()! ?? "0");
    formData.append("DeductFees", val.deductFees?.toString() ?? "false");
    formData.append("VatPerc", val.vatPerc?.toString()! ?? "0");
    formData.append("VatValue", val.vatValue?.toString()! ?? "0");
    formData.append("TotalPremium", val.totalPremium?.toString()! ?? "0");
    formData.append("CompCommDNCNNo", val.compCommDNCNNo! ?? "");
    formData.append("CompCommPerc", val.compCommPerc?.toString()! ?? "0");
    formData.append("CompCommVAT", val.compCommVAT?.toString()! ?? "0");
    formData.append("CompComm", val.compCommAmount?.toString()! ?? "0");
    formData.append(
      "ProducerCommPerc",
      val.producerCommPerc?.toString()! ?? ""
    );
    formData.append("ProducerComm", val.producerComm?.toString()! ?? "0");
    formData.append("Branch", val.branch! ?? "");

    let terms = val.paymentTermsList!;
    for (let i = 0; i < terms.length; i++) {
      formData.append(
        `PaymentTermsList[${i}].payDate`,
        this.appUtils.dateFormater(terms[i].payDate)
      );
      formData.append(
        `PaymentTermsList[${i}].percentage`,
        terms[i].percentage?.toString()! ?? ""
      );
      formData.append(
        `PaymentTermsList[${i}].amount`,
        terms[i].amount?.toString()! ?? ""
      );
      formData.append(
        `PaymentTermsList[${i}].policyFees`,
        terms[i].policyFees?.toString()! ?? ""
      );
      formData.append(
        `PaymentTermsList[${i}].vatAmount`,
        terms[i].vatAmount?.toString()! ?? ""
      );
    }

    let commissions = val.producersCommissionsList!;
    for (let i = 0; i < commissions.length; i++) {
      formData.append(
        `ProducersCommissionsList[${i}].producer`,
        commissions[i].producer!
      );
      formData.append(
        `ProducersCommissionsList[${i}].percentage`,
        commissions[i].percentage?.toString()! ?? ""
      );
      formData.append(
        `ProducersCommissionsList[${i}].amount`,
        commissions[i].amount?.toString()! ?? ""
      );
    }

    this.documentsToUpload.forEach((el) => formData.append("Documents", el));

    let sub = this.productionService
      .savePolicy(formData)
      .subscribe((res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.message.toast(res.body.message!, "success");
          if (this.uiState.editMode)
            this.router.navigate([AppRoutes.Production.base]);
          this.resetForm();
        } else this.message.popup("Sorry!", res.body?.message!, "warning");
        this.eventService.broadcast(reserved.isLoading, false);
      });
    this.subscribes.push(sub);
  }

  resetForm(): void {
    this.formGroup.reset();
    this.f.paymentTermsList?.clear();
    this.f.producersCommissionsList?.clear();
    this.f.periodTo?.enable();
    this.f.searchType?.patchValue("Client");
    this.f.issueType?.patchValue("new");
    this.f.requestNo?.clearValidators();
    this.documentsToUpload = [];
    this.dropzone.clearImages();
    this.uiState.submitted = false;
  }
  //#endregion

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
