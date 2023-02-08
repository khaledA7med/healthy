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
import { searchBy } from "src/app/shared/app/models/Production/production-util";
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
      searchType: new FormControl(searchBy.client),
      producer: new FormControl(null, Validators.required),
      chPolicyHolder: new FormControl(false),
      policyHolder: new FormControl({ value: null, disabled: true }),
      requestInfo: new FormControl(null),
      clientInfo: new FormControl(null, Validators.required),
      clientName: new FormControl(null, Validators.required),
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
      this.f.requestInfo?.setValidators(Validators.required);
    else this.f.requestInfo?.clearValidators();
    this.f.requestInfo?.updateValueAndValidity();
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

  documentsList(e: any) {}

  onSubmit(e: any) {
    this.submitted = true;
  }

  resetForm() {}

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((e) => e.unsubscribe());
  }
}
