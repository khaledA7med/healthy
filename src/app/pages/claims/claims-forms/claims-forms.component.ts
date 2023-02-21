import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import {
  ClaimsType,
  IClaimPoliciesSearch,
} from "src/app/shared/app/models/Claims/claims-util";
import { IClaimsForms } from "src/app/shared/app/models/Claims/iclaims-forms";
import { DropzoneComponent } from "src/app/shared/components/dropzone/dropzone/dropzone.component";
import { ClaimsRequestListComponent } from "./claims-request-list.component";

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
  };
  documentsToUpload: File[] = [];
  docs: any[] = [];
  @ViewChild(DropzoneComponent) dropzone!: DropzoneComponent;

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
    });
  }

  get f(): IClaimsForms {
    return this.formGroup.controls;
  }

  //#region Policy Details Section
  openModal(modal: TemplateRef<NgbModalOptions>) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      size: "xl",
      backdrop: "static",
    });
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

  documentsList(e: any) {
    console.log(e);
  }

  onSubmit() {}

  resetForm() {}
}
