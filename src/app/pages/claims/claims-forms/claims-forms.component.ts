import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import {
  ClaimsType,
  IClaimPoliciesSearch,
} from "src/app/shared/app/models/Claims/claims-util";
import { IClaimsForms } from "src/app/shared/app/models/Claims/iclaims-forms";
import { DropzoneComponent } from "src/app/shared/components/dropzone/dropzone/dropzone.component";
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
    modalConfig: {
      centered: true,
      size: "xl",
      backdrop: "static",
    } as NgbModalOptions,
  };
  documentsToUpload: File[] = [];
  docs: any[] = [];
  @ViewChild(DropzoneComponent) dropzone!: DropzoneComponent;

  subscribes: Subscription[] = [];
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.initForm();
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
      ckClaimAmount: new FormControl(true),
      claimAmount: new FormControl(null),
      otherCurrAmount: new FormControl({ value: null, disabled: true }),
      otherCurr: new FormControl({ value: "SAR", disabled: true }),
      exchangeRate: new FormControl(1),
      estimatedValue: new FormControl(null),
      salvage: new FormControl(null),
      contactName: new FormControl(null),
      contactEmail: new FormControl(null),
      contactTele: new FormControl(null),
      notes: new FormControl(null),

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
      status: new FormControl(null, Validators.required),
      claimStatusNotes: new FormControl(null, Validators.required),

      claimantMobile: new FormControl(null),
      claimantEmail: new FormControl(null),
      claimantIBAN: new FormControl(null),
      bankName: new FormControl(null, Validators.required),
      bankBranch: new FormControl(null),
      bankCity: new FormControl(null),

      // Medical
      medID: new FormControl(null, Validators.required),
      hospital: new FormControl(null, Validators.required),
      medClass: new FormControl(null, Validators.required),
      medCaseType: new FormControl(null, Validators.required),

      /* Motor  */
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

      // General
      nameofInjured: new FormControl(null),
      natureofLoss: new FormControl(null),
      lossLocation: new FormControl(null),
      claimExcess: new FormControl(null),
      interimPayment: new FormControl(null),
      recovery: new FormControl(null),
      liability: new FormControl(null),
      claimCertificateNo: new FormControl(null),
      declarationNo: new FormControl(null),
      shipmentName: new FormControl(null),
      generalChassisNo: new FormControl(null),
    });
  }

  get f(): IClaimsForms {
    return this.formGroup.controls;
  }

  //#region Policy Details Section
  openModal(modal: TemplateRef<NgbModalOptions>) {
    this.modalRef = this.modalService.open(modal, this.uiState.modalConfig);
  }

  claimTypeTogglerEvt(): void {
    console.log();
    switch (this.f.claimType?.value) {
      case this.uiState.claimTypes.Medical:
        break;
      case this.uiState.claimTypes.Motor:
        break;
      case this.uiState.claimTypes.General:
        break;
      default:
        break;
    }
  }

  fillRequestDataToForm(e: any): void {
    console.log(e);
  }
  //#endregion

  //#region Payments Section
  addPayment(): void {
    this.modalRef = this.modalService.open(ClaimPaymentsFormComponent, {
      centered: true,
      size: "lg",
      backdrop: "static",
    });
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
    this.modalRef = this.modalService.open(ClaimApprovalsFormComponent, {
      centered: true,
      size: "lg",
      backdrop: "static",
    });
  }
  //#endregion

  //#region Invoices Section
  addInvoice(): void {
    this.modalRef = this.modalService.open(ClaimInvoicesFormComponent, {
      centered: true,
      size: "lg",
      backdrop: "static",
    });
  }
  //#endregion

  //#region Rejection/Deduction Section
  addRejectDeduction(): void {
    this.modalRef = this.modalService.open(ClaimRejectDeductFormComponent, {
      centered: true,
      size: "lg",
      backdrop: "static",
    });
  }
  //#endregion

  documentsList(e: any) {
    console.log(e);
  }

  onSubmit() {}

  resetForm() {}
}
