import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { IProductionForms } from "src/app/shared/app/models/Production/iproduction-forms";
import { searchBy } from "src/app/shared/app/models/Production/production-util";

@Component({
  selector: "app-policies-forms",
  templateUrl: "./policies-forms.component.html",
  styleUrls: ["./policies-forms.component.scss"],
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
  };

  docs: any[] = [];
  @ViewChild("dropzone") dropzone!: any;
  subscribes: Subscription[] = [];

  constructor() {}

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
      clientName: new FormControl(null),
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

  documentsList(e: any) {}

  onSubmit(e: any) {
    this.submitted = true;
  }

  resetForm() {}

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((e) => e.unsubscribe());
  }
}
