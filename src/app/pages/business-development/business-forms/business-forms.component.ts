import { BusinessDevelopmentService } from "./../../../shared/services/business-development/business-development.service";
import { ISalesLeadForm } from "./../../../shared/app/models/BusinessDevelopment/isalesLeadForm";
import { FormControl, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import {
  Caching,
  IBaseMasterTable,
  IGenericResponseType,
} from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { NgSelectComponent } from "@ng-select/ng-select";
import { HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";

@Component({
  selector: "app-business-forms",
  templateUrl: "./business-forms.component.html",
  styleUrls: ["./business-forms.component.scss"],
})
export class BusinessFormsComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup<ISalesLeadForm>;
  formData!: Observable<IBaseMasterTable>;
  submitted: boolean = false;
  subscribes: Subscription[] = [];
  documentsToUpload: File[] = [];
  docs: any[] = [];
  uiState = {
    isClient: true, // Choose client Or Group
  };
  @ViewChild("clintSelect") clintSelect!: NgSelectComponent;

  constructor(
    private tables: MasterTableService,
    private businessDevService: BusinessDevelopmentService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.formData = this.tables.getBaseData(MODULES.BusinessDevelopmentForm);
    this.formData.subscribe((res) => console.log(res));
  }

  initForm() {
    this.formGroup = new FormGroup<ISalesLeadForm>({
      leadType: new FormControl("New"),
      clientID: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      producer: new FormControl(null, Validators.required),
      classOfBusiness: new FormControl(null, Validators.required),
    });
  }
  get f() {
    return this.formGroup.controls;
  }
  changeToClient() {
    this.uiState.isClient = true;
    this.clintSelect.clearModel();
  }
  changeToGroup() {
    this.uiState.isClient = false;
    this.clintSelect.clearModel();
  }
  getClientId(e: any) {
    this.f.clientID?.patchValue(e.id);
  }
  getLineOfBusiness(e: string) {
    console.log(e);
    let sub = this.businessDevService.lineOfBusiness(e).subscribe({
      next: (
        res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>
      ) => {},
    });
    this.subscribes.push(sub);
  }

  toggleDate(e: any) {}
  toggleCurInsured() {}
  documentsList(e: any) {}
  submitForm() {
    this.submitted = true;
    console.log(this.f.name?.touched);
  }

  ngOnDestroy(): void {
    this.subscribes.forEach((sub) => sub.unsubscribe());
  }
}
