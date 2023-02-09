import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { EventService } from "src/app/core/services/event.service";
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

  documentsList(e: any) {}

  onSubmit(e: any) {
    this.submitted = true;
  }

  resetForm() {}

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((e) => e.unsubscribe());
  }
}
