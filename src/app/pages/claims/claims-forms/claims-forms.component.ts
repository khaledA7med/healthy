import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
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
import {
  ClaimsType,
  IClaimPolicies,
  IClaimPoliciesSearch,
  IClaimTransactionList,
} from "src/app/shared/app/models/Claims/claims-util";
import {
  IClaimRejectDeduct,
  IClaimRejectDeductForm,
} from "src/app/shared/app/models/Claims/iclaim-reject-deduct-form";
import {
  IClaimAmountForm,
  IClaimGeneralForm,
  IClaimMedicalForm,
  IClaimMotorForm,
  IClaimsForms,
  IClaimsGeneralListForm,
} from "src/app/shared/app/models/Claims/iclaims-forms";
import AppUtils from "src/app/shared/app/util";
import { DropzoneComponent } from "src/app/shared/components/dropzone/dropzone/dropzone.component";
import { ClaimsService } from "src/app/shared/services/claims/claims.service";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ClaimApprovalsFormComponent } from "./form-helpers/claim-approvals-form.component";
import { ClaimInvoicesFormComponent } from "./form-helpers/claim-invoices-form.component";
import { ClaimPaymentsFormComponent } from "./form-helpers/claim-payments-form.component";
import { ClaimRejectDeductFormComponent } from "./form-helpers/claim-reject-deduct-form.component";

@Component({
  selector: "app-claims-forms",
  templateUrl: "./claims-forms.component.html",
  styleUrls: ["./claims-forms.component.scss"],
})
export class ClaimsFormsComponent implements OnInit {
  formGroup!: FormGroup<IClaimsForms>;
  formData!: Observable<IBaseMasterTable>;
  modalRef!: NgbModalRef;
  uiState = {
    claimTypes: ClaimsType,
    submitted: false as boolean,
    editMode: false as boolean,
    searchRequest: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sNo",
      orderDir: "asc",
      clientName: "",
      insuranceCompany: null,
      classOfInsurance: null,
      lineOfBusiness: null,
      policyNo: null,
    } as IClaimPoliciesSearch,
    policies: {
      insuranceClasses: [] as IGenericResponseType[],
      lineOfBusiness: [] as IGenericResponseType[],
      clientOutStanding: [] as IClaimTransactionList[],
    },
    claimLists: {
      statusNotes: [] as IGenericResponseType[],
      requiredDocs: [] as string[],
      rejectDeductList: [] as IClaimRejectDeduct[],
    },
    modalConfig: {
      centered: true,
      size: "lg",
      backdrop: "static",
    } as NgbModalOptions,
  };
  documentsToUpload: File[] = [];
  docs: any[] = [];
  @ViewChild(DropzoneComponent) dropzone!: DropzoneComponent;

  subscribes: Subscription[] = [];
  constructor(
    private modalService: NgbModal,
    private tables: MasterTableService,
    private methods: MasterMethodsService,
    private claimService: ClaimsService,
    private eventService: EventService,
    private util: AppUtils,
    private message: MessagesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.formDataHandler();
  }

  //#region Global Handlers
  formDataHandler(): void {
    this.formData = this.tables.getBaseData(MODULES.ClaimsForm);
    let sub = this.formData.subscribe((res) => {
      this.uiState.policies.insuranceClasses = res.InsurClasses?.content.filter(
        (el) =>
          el.name !== this.uiState.claimTypes.Medical &&
          el.name !== this.uiState.claimTypes.Motor
      )!;
    });
    this.subscribes.push(sub);

    // Claim Medical Type
    this.medicalClaimType();

    // Claimant Amounts Calc
    this.claimAmountHandler();

    // Set Default Dates
    let date = new Date();
    let now = {
      gon: {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      },
    };
    this.datesValuePatcher(now, this.f.intimationDate!);
    this.datesValuePatcher(now, this.f.dateOfLoss!);
    this.datesValuePatcher(now, this.f.dateOfReceive!);
    this.datesValuePatcher(now, this.f.dateOfSubmission!);
    this.datesValuePatcher(now, this.f.dateOfDeadline!);
  }

  initForm(): void {
    this.formGroup = new FormGroup<IClaimsForms>({
      claimType: new FormControl(this.uiState.claimTypes.Medical),
      clientInfo: new FormControl(null, Validators.required),
      policyNo: new FormControl(null, Validators.required),
      className: new FormControl(null, Validators.required),
      dateOfLossFrom: new FormControl(null, Validators.required),
      dateOfLossTo: new FormControl(null, Validators.required),
      projectTitle: new FormControl(null),
      insuranceCompany: new FormControl(null, Validators.required),
      lineOfBusiness: new FormControl(null, Validators.required),
      previousClaimsNo: new FormControl(null),
      insurCompClaimNo: new FormControl(null),
      insuredClaimNo: new FormControl(null),
      membName: new FormControl(null, Validators.required),
      bLAWBNo: new FormControl(null),
      lostadjuster: new FormControl(null),
      lostadjusterEmail: new FormControl(null),
      lostadjusterTele: new FormControl(null),

      // Claim Amounts
      claimAmounts: new FormGroup<IClaimAmountForm>({
        ckClaimAmount: new FormControl(true),
        claimAmount: new FormControl(null),
        otherCurrAmount: new FormControl({ value: null, disabled: true }),
        otherCurr: new FormControl({ value: "SAR", disabled: true }),
        exchangeRate: new FormControl(1),
        estimatedValue: new FormControl(null),
        salvage: new FormControl(null),
      }),

      contactName: new FormControl(null),
      contactEmail: new FormControl(null),
      contactTele: new FormControl(null),
      notes: new FormControl(null),

      // Dates
      chIntimationDate: new FormControl(true),
      intimationDate: new FormControl(null),
      chDateOfLoss: new FormControl(true),
      dateOfLoss: new FormControl(null),
      chDateOfReceive: new FormControl(true),
      dateOfReceive: new FormControl(null),
      chDateofSubmission: new FormControl(true),
      dateOfSubmission: new FormControl(null),
      chDateOfDeadline: new FormControl(true),
      dateOfDeadline: new FormControl(null),

      // Claim Status
      status: new FormControl(null, Validators.required),
      claimStatusNotes: new FormControl(null, Validators.required),

      // Claimant Details
      claimantMobile: new FormControl(null),
      claimantEmail: new FormControl(null),
      claimantIBAN: new FormControl(null),
      bankName: new FormControl(null, Validators.required),
      bankBranch: new FormControl(null),
      bankCity: new FormControl(null),

      // Required Docs
      requiredDocumentList: new FormArray<
        FormGroup<{
          item?: FormControl<string | null>;
          checked?: FormControl<boolean | null>;
        }>
      >([]),
      chAllDocuments: new FormControl(false),

      //Medical
      medical: new FormGroup<IClaimMedicalForm>({
        medID: new FormControl(null, Validators.required),
        hospital: new FormControl(null, Validators.required),
        medClass: new FormControl(null, Validators.required),
        medCaseType: new FormControl(null, Validators.required),
      }),

      /* Motor  */
      motor: new FormGroup<IClaimMotorForm>({
        carPaletNo: new FormControl(null, Validators.required),
        motorChassisNo: new FormControl(null),
        mistakePercentage: new FormControl(null),
        type: new FormControl(null),
        carsMake: new FormControl(null),
        model: new FormControl(null),
        typeOfrepair: new FormControl(null),
        city: new FormControl(null),
        workshopAgency: new FormControl(null),
        accidentNumber: new FormControl(null),
        TPL: new FormControl(null),
        excess: new FormControl(null),
        policyExcess: new FormControl(null),
        policyCertificateNo: new FormControl(null),
      }),

      // General
      general: new FormGroup<IClaimGeneralForm>({
        nameofInjured: new FormControl(null),
        natureofLoss: new FormControl(null),
        lossLocation: new FormControl(null),
        claimExcess: new FormControl(null),
        interimPayment: new FormControl(null),
        recovery: new FormControl(null),
        liability: new FormControl(null),
        claimCertificateNo: new FormControl(null),
        generalChassisNo: new FormControl(null),
        declarationNo: new FormControl(null),
        shipmentName: new FormControl(null),
        claimsGeneral: new FormArray<FormGroup<IClaimsGeneralListForm>>([]),
      }),

      branch: new FormControl(null),
    });
  }

  get f(): IClaimsForms {
    return this.formGroup.controls;
  }

  get amounts(): IClaimAmountForm {
    return this.f.claimAmounts?.controls!;
  }

  get medical(): IClaimMedicalForm {
    return this.f.medical?.controls!;
  }

  get motor(): IClaimMotorForm {
    return this.f.motor?.controls!;
  }

  get general(): IClaimGeneralForm {
    return this.f.general?.controls!;
  }
  //#endregion

  //#region Policy Details Section
  openModal(modal: TemplateRef<NgbModalOptions>) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      size: "xl",
      backdrop: "static",
    });
  }

  claimTypeTogglerEvt(): void {
    this.uiState.searchRequest.lineOfBusiness = null;
    switch (this.f.claimType?.value) {
      case this.uiState.claimTypes.Medical:
        this.medicalClaimType();
        break;
      case this.uiState.claimTypes.Motor:
        this.motorClaimType();
        break;
      case this.uiState.claimTypes.General:
        this.generalClaimType();
        break;
      default:
        break;
    }
  }

  getLineOfBusiness(cls: string): void {
    let sub = this.methods
      .getLineOfBusiness(cls)
      .subscribe(
        (res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>) => {
          this.uiState.policies.lineOfBusiness = res.body?.data?.content!;
        }
      );
    this.subscribes.push(sub);
  }

  medicalClaimType(): void {
    this.getLineOfBusiness(this.uiState.claimTypes.Medical);
    this.uiState.searchRequest.classOfInsurance =
      this.uiState.claimTypes.Medical;
    this.f.medical?.enable();
    this.f.general?.disable();
    this.f.motor?.disable();
    this.general.claimsGeneral?.clear();
  }

  motorClaimType(): void {
    this.getLineOfBusiness(this.uiState.claimTypes.Motor);
    this.uiState.searchRequest.classOfInsurance = this.uiState.claimTypes.Motor;
    this.f.medical?.disable();
    this.f.general?.disable();
    this.f.motor?.enable();
    this.general.claimsGeneral?.clear();
  }

  generalClaimType(): void {
    this.uiState.searchRequest.classOfInsurance = null;
    this.f.medical?.disable();
    this.f.general?.enable();
    this.f.motor?.disable();
  }

  fillRequestDataToForm(evt: IClaimPolicies): void {
    this.f.requiredDocumentList.clear();
    this.general.claimsGeneral?.clear();
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.claimService.searchClientClaimData(evt).subscribe(
      (res: IBaseResponse<IClaimPolicies>) => {
        this.formGroup.patchValue({
          clientInfo: `${evt.clientNo} | ${evt.clientName}`,
          clientID: evt.clientNo,
          clientName: evt.clientName,
          policyNo: evt.policyNo,
          className: evt.className,
          // projectTitle:
          insuranceCompany: evt.insurComp,
          lineOfBusiness: evt.lineOfBusiness,
        });

        this.f.dateOfLossFrom?.patchValue(
          this.util.dateStructFormat(evt.periodFrom) as any
        );
        this.f.dateOfLossTo?.patchValue(
          this.util.dateStructFormat(evt.periodTo) as any
        );
        this.uiState.policies.clientOutStanding =
          res.data?.claimTransactionList!;

        res.data?.claimGeneralList?.forEach((el) => this.addGeneralItems(el));
        res.data?.requiredDocumentList?.forEach((el) =>
          this.addRequiredDocs(el)
        );
        this.modalRef.close();
        this.eventService.broadcast(reserved.isLoading, false);
      },
      (err: HttpErrorResponse) =>
        this.message.popup("Oops!", err.message, "error")
    );
    this.subscribes.push(sub);
  }
  //#endregion

  //#region Claim Details Section
  // Claim Amount Handler
  claimAmountHandler(): void {
    let sub = this.amounts.ckClaimAmount?.valueChanges.subscribe((el) => {
      console.log(el);
      if (el) {
        this.amounts.otherCurr?.disable();
        this.amounts.otherCurr?.patchValue("SAR");
        this.amounts.otherCurrAmount?.disable();
        this.amounts.claimAmount?.enable();
        this.currencyBinder({ name: "SAR", rate: 1 });
      } else {
        this.amounts.claimAmount?.disable();
        this.amounts.otherCurr?.enable();
        this.amounts.otherCurr?.reset();
        this.amounts.otherCurrAmount?.enable();
      }
    });
    this.subscribes.push(sub!);
  }

  currencyBinder(evt: any) {
    this.amounts.exchangeRate?.patchValue(evt.rate);
    this.claimAmountValueExg();
  }

  otherClaimAmountValue(): void {
    this.amounts.otherCurrAmount?.patchValue(this.amounts.claimAmount?.value!);
  }

  claimAmountValueExg(): void {
    this.amounts.claimAmount?.patchValue(
      this.amounts.exchangeRate?.value! * this.amounts.otherCurrAmount?.value!
    );
  }

  // Dates Handler
  claimDatesHandler(evt: Event, control: AbstractControl) {
    if ((evt.target as HTMLInputElement).checked) {
      let date = new Date();
      let now = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
      control.patchValue(now);
      control.enable();
    } else {
      control.reset();
      control.disable();
    }
  }

  datesValuePatcher(e: any, control: AbstractControl) {
    control.patchValue(e.gon);
  }

  // Claim Status
  getStatusNotes(status: string) {
    this.f.claimStatusNotes?.reset();
    let sub = this.claimService.getClaimStatusNotes([status]).subscribe(
      (res: IBaseResponse<IGenericResponseType[]>) =>
        (this.uiState.claimLists.statusNotes = res.data!),
      (err: HttpErrorResponse) =>
        this.message.popup("Oops!", err.message, "error")
    );
    this.subscribes.push(sub);
  }

  // Required Documents
  addRequiredDocs(el: any): void {
    let docs = new FormGroup<{
      item?: FormControl<string | null>;
      checked?: FormControl<boolean | null>;
    }>({
      checked: new FormControl(false),
      item: new FormControl(el.name),
    });
    this.f.requiredDocumentList.push(docs);
  }

  get docList(): FormArray {
    return this.f.requiredDocumentList as FormArray;
  }

  documentListControl(i: number, control: string): AbstractControl {
    return this.docList.controls[i].get(control)!;
  }

  addToDocList(i: number, val: string): void {
    if (this.documentListControl(i, val).value)
      this.uiState.claimLists.requiredDocs.push(
        this.documentListControl(i, "item").value
      );
    else
      this.uiState.claimLists.requiredDocs =
        this.uiState.claimLists.requiredDocs.filter(
          (el) => el !== this.documentListControl(i, "item").value
        );

    if (
      this.uiState.claimLists.requiredDocs.length !==
      this.docList.controls.length
    )
      this.f.chAllDocuments.patchValue(false);
    else this.f.chAllDocuments.patchValue(true);
  }

  checkAllDocuments(evt: Event) {
    let elm = (evt.target as HTMLInputElement).checked;
    this.docList.controls.forEach((el, i) => {
      if (elm) {
        this.documentListControl(i, "checked").patchValue(true);
        if (!this.uiState.claimLists.requiredDocs.includes(el.value.item))
          this.uiState.claimLists.requiredDocs.push(el.value.item);
      } else {
        this.documentListControl(i, "checked").patchValue(false);
        if (!(el.value.item in this.uiState.claimLists.requiredDocs))
          this.uiState.claimLists.requiredDocs = [];
      }
    });
    if (
      this.uiState.claimLists.requiredDocs.length !==
      this.docList.controls.length
    )
      this.f.chAllDocuments.patchValue(false);
    else this.f.chAllDocuments.patchValue(true);
  }

  //#endregion

  //#region Payments Section
  addPayment(): void {
    this.modalRef = this.modalService.open(
      ClaimPaymentsFormComponent,
      this.uiState.modalConfig
    );
    this.modalRef.componentInstance.data = {
      // sNo: 50,
      clientName: "hahah",
    };

    let sub = this.modalRef.closed.subscribe((res) => {
      console.log(res);
    });
    this.subscribes.push(sub);
  }
  //#endregion

  //#region Approvals Section
  addApproval(): void {
    this.modalRef = this.modalService.open(
      ClaimApprovalsFormComponent,
      this.uiState.modalConfig
    );
  }
  //#endregion

  //#region Invoices Section
  addInvoice(): void {
    this.modalRef = this.modalService.open(
      ClaimInvoicesFormComponent,
      this.uiState.modalConfig
    );
  }
  //#endregion

  //#region Rejection/Deduction Section
  addRejectDeduction(): void {
    this.modalRef = this.modalService.open(
      ClaimRejectDeductFormComponent,
      this.uiState.modalConfig
    );

    this.modalRef.componentInstance.formEditMode = this.uiState.editMode;
    this.modalRef.componentInstance.data = {
      sNo: 0,
      clientName: this.f.clientName,
      clientNo: this.f.clientID,
    };

    let sub = this.modalRef.closed.subscribe((res) => {});
    let sub2 = this.modalRef.componentInstance.rejectDeductItem.subscribe(
      (res: IClaimRejectDeduct) => {
        if (this.uiState.editMode) {
        } else {
          this.uiState.claimLists.rejectDeductList.push(res);
        }
      }
    );
    this.subscribes.push(sub, sub2);
  }

  removeRejectDeduct(i: any): void {
    this.uiState.claimLists.rejectDeductList.splice(i, 1);
  }
  //#endregion

  //#region General Claims Section
  get generalList(): FormArray {
    return this.f.general?.get("claimsGeneral") as FormArray;
  }

  generalListControls(i: number, control: string): AbstractControl {
    return this.generalList.controls[i].get(control)!;
  }

  addGeneralItems(el?: any) {
    let item = new FormGroup<IClaimsGeneralListForm>({
      claimNo: new FormControl(null),
      clientName: new FormControl(null),
      clientNo: new FormControl(null),
      item: new FormControl(el.item),
      mandatory: new FormControl(el.mandatory),
      value: new FormControl(null, el.mandatory && Validators.required),
    });
    this.general.claimsGeneral?.push(item);
  }

  removeGeneralItem(i: number) {
    this.generalList.removeAt(i);
  }
  //#endregion

  documentsList(e: any) {
    this.documentsToUpload = e;
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

  onSubmit(): void {
    this.uiState.submitted = true;
    if (!this.validationChecker()) return;
    let val = this.formGroup.getRawValue();
    const formData = new FormData();

    for (let doc of this.documentsToUpload) formData.append("documents", doc);

    formData.append(
      "requiredDocuments",
      this.uiState.claimLists.requiredDocs.join(";")
    );

    let reject = this.uiState.claimLists.rejectDeductList;
    for (let i = 0; i < reject.length; i++) {
      formData.append(
        `ClaimRejectionDeductionsList[${i}].clientNo`,
        reject[i].clientNo!.toString()
      );
      formData.append(
        `ClaimRejectionDeductionsList[${i}].clientName`,
        reject[i].clientName!
      );
      formData.append(
        `ClaimRejectionDeductionsList[${i}].amount`,
        reject[i].amount!.toString()
      );
      formData.append(
        `ClaimRejectionDeductionsList[${i}].type`,
        reject[i].type!
      );
      formData.append(
        `ClaimRejectionDeductionsList[${i}].rejectionNote`,
        reject[i].rejectionNote!
      );
      formData.append(
        `ClaimRejectionDeductionsList[${i}].rejectionReason`,
        reject[i].rejectionReason!
      );
      formData.append(
        `ClaimRejectionDeductionsList[${i}].rejectionReason`,
        reject[i].rejectionReason!
      );
      formData.append(
        `ClaimRejectionDeductionsList[${i}].rejectionReason`,
        reject[i].rejectionReason!
      );
    }

    let itemDetail = val.general?.claimsGeneral!;

    for (let i = 0; i < itemDetail.length; i++) {
      formData.append(
        `ClaimsGeneral[${i}].clientNo`,
        itemDetail[i].clientNo!.toString()
      );
      formData.append(
        `ClaimsGeneral[${i}].clientName`,
        itemDetail[i].clientName!
      );
      formData.append(`ClaimsGeneral[${i}].item`, itemDetail[i].item!);
      formData.append(
        `ClaimsGeneral[${i}].value`,
        itemDetail[i].value!.toString()
      );
      formData.append(
        `ClaimsGeneral[${i}].mandatory`,
        itemDetail[i].mandatory!.toString()
      );
      formData.append(
        `ClaimsGeneral[${i}].clientNo`,
        itemDetail[i].clientNo!.toString()
      );
      formData.append(
        `ClaimsGeneral[${i}].clientNo`,
        itemDetail[i].clientNo!.toString()
      );
    }

    formData.append("branch", val.branch ?? "");
    formData.append("PolicyNo", val.policyNo ?? "");
    formData.append("cNo", val.sNo?.toString()! ?? "");
    formData.append("ClientName", val.clientName ?? "");
    formData.append("clientID", val.clientID ?? "");
    formData.append("claimType", val.claimType ?? "");
    formData.append("insurCompClaimNo", val.insurCompClaimNo ?? "");
    formData.append("insuredClaimNo", val.insuredClaimNo ?? "");
    formData.append("status", val.status ?? "");
    formData.append("claimStatusNotes", val.claimStatusNotes ?? "");
    formData.append("blawbNo", val.bLAWBNo ?? "");
    formData.append("insuranceCompany", val.insuranceCompany ?? "");
    formData.append("className", val.className ?? "");
    formData.append("LineOfBusiness", val.lineOfBusiness ?? "");
    // formData.append("PoliciesSNo", sNo.value ?? "");

    // Medical
    formData.append("membName", val.membName ?? "");
    formData.append("medID", val.medical?.medID ?? "");
    formData.append("medClass", val.medical?.medClass ?? "");
    formData.append("medCaseType", val.medical?.medCaseType ?? "");
    formData.append("hospital", val.medical?.hospital ?? "");

    // Motor
    formData.append("carPaletNo", val.motor?.carPaletNo ?? "");
    formData.append("carsMake", val.motor?.carsMake ?? "");
    formData.append("model", val.motor?.model ?? "");
    formData.append("typeOfrepair", val.motor?.typeOfrepair ?? "");
    formData.append("type", val.motor?.type ?? "");
    formData.append("city", val.motor?.city ?? "");
    formData.append("workshopAgency", val.motor?.workshopAgency ?? "");
    formData.append("accidentNumber", val.motor?.accidentNumber ?? "");
    formData.append("MotorChassisNo", val.motor?.motorChassisNo ?? "");
    formData.append(
      "mistakePercentage",
      val.motor?.mistakePercentage?.toString() ?? ""
    );
    formData.append("tpl", val.motor?.TPL?.toString() ?? "");
    formData.append("excess", val.motor?.excess?.toString() ?? "");

    formData.append("generalChassisNo", val.general?.generalChassisNo ?? "");
    formData.append("nameofInjured", val.general?.nameofInjured ?? "");
    formData.append("natureofLoss", val.general?.natureofLoss ?? "");
    formData.append("lossLocation", val.general?.lossLocation ?? "");
    formData.append("PolicyExcess", val.general?.claimExcess!.toString() ?? "");
    formData.append(
      "interimPayment",
      val.general?.interimPayment?.toString() ?? ""
    );
    formData.append("recovery", val.general?.recovery ?? "");
    formData.append("liability", val.general?.liability ?? "");
    formData.append(
      "PolicyCertificateNo",
      val.general?.claimCertificateNo ?? ""
    );
    formData.append("declarationNo", val.general?.declarationNo ?? "");
    formData.append("shipmentName", val.general?.shipmentName ?? "");

    // Claim Amount
    formData.append(
      "estimatedValue",
      val.claimAmounts?.estimatedValue?.toString() ?? "0"
    );
    formData.append("salvage", val.claimAmounts?.salvage?.toString() ?? "0");
    formData.append(
      "claimAmount",
      val.claimAmounts?.claimAmount?.toString() ?? ""
    );
    formData.append(
      "otherCurrAmount",
      val.claimAmounts?.otherCurrAmount?.toString() ?? ""
    );
    formData.append("otherCurr", val.claimAmounts?.otherCurr!);

    // Dates
    formData.append("chIntimationDate", val.chIntimationDate?.toString()!);
    formData.append(
      "intimationDate",
      this.util.dateFormater(val.intimationDate!)
    );
    formData.append("chDateOfLoss", val.chDateOfLoss?.toString()!);
    formData.append("dateOfLoss", this.util.dateFormater(val.dateOfLoss));
    formData.append("chDateOfReceive", val.chDateOfReceive?.toString()!);
    formData.append("dateOfReceive", this.util.dateFormater(val.dateOfReceive));
    formData.append("chDateofSubmission", val.chDateofSubmission?.toString()!);
    formData.append(
      "dateOfSubmission",
      this.util.dateFormater(val.dateOfSubmission)
    );
    formData.append("chDateOfDeadline", val.chDateOfDeadline?.toString()!);
    formData.append(
      "DateOfDeadline",
      this.util.dateFormater(val.dateOfDeadline)
    );

    // Claimant Details
    formData.append("claimantMobile", val.claimantMobile ?? "");
    formData.append("claimantEmail", val.claimantEmail ?? "");
    formData.append("claimantIBAN", val.claimantIBAN ?? "");
    formData.append("bankName", val.bankName ?? "");
    formData.append("bankBranch", val.bankBranch ?? "");
    formData.append("bankCity", val.bankCity ?? "");

    // Loss Adjuster
    formData.append("lostadjuster", val.lostadjuster ?? "");
    formData.append("lostadjusterEmail", val.lostadjusterEmail ?? "");
    formData.append("LostadjusterTele", val.lostadjusterTele ?? "");

    // Contacts
    formData.append("notes", val.notes ?? "");
    formData.append("contactName", val.contactName ?? "");
    formData.append("contactEmail", val.contactEmail ?? "");
    formData.append("contactTele", val.contactTele ?? "");

    formData.append("projectTitle", val.projectTitle ?? "");
  }

  resetForm() {}
}
