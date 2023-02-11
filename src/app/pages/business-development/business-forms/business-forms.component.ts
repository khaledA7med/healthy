import { IQoutingRequirement } from "./../../../shared/app/models/BusinessDevelopment/iqoutingReq";
import { IActivityLog } from "./../../../shared/app/models/BusinessDevelopment/iactivity-log";
import { ICompetitors } from "./../../../shared/app/models/BusinessDevelopment/icompetitors";
import { BusinessDevelopmentService } from "./../../../shared/services/business-development/business-development.service";
import { ISalesLeadForm } from "./../../../shared/app/models/BusinessDevelopment/isalesLeadForm";
import {
  AbstractControl,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
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

import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";

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
  lineOfBussArr: IGenericResponseType[] = [];
  documentsToUpload: File[] = [];
  docs: any[] = [];

  uiState = {
    isClient: true, // Choose client Or Group
    isCurrentIns: false,
    quotingCompanyArr: [] as IQoutingRequirement[],
    policyCompanyArr: [],
  };
  @ViewChild("dropzone") dropzone!: any;

  constructor(
    private tables: MasterTableService,
    private businessDevService: BusinessDevelopmentService,
    private message: MessagesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.formData = this.tables.getBaseData(MODULES.BusinessDevelopmentForm);
  }

  initForm() {
    this.formGroup = new FormGroup<ISalesLeadForm>({
      //lead details
      leadType: new FormControl("New"),
      clientID: new FormControl(0, Validators.required),
      name: new FormControl(null, Validators.required),
      producer: new FormControl(null, Validators.required),
      //insurance details
      classOfBusiness: new FormControl(null, Validators.required),
      lineOfBusiness: new FormControl(null, Validators.required),
      estimatedPremium: new FormControl(0),
      deadLine: new FormControl({ value: null, disabled: true }),
      chDeadline: new FormControl(0),
      chDeadlinebool: new FormControl(false),
      preferedInsurComapnies: new FormControl([]),
      policyDetails: new FormControl(null, Validators.required),
      //currently insurance
      existingPolExpDate: new FormControl({ value: null, disabled: true }),
      currentPolicyNo: new FormControl({ value: null, disabled: true }),
      currentBroker: new FormControl({ value: null, disabled: true }),
      currentInsurer: new FormControl({ value: null, disabled: true }),
      existingPolDetails: new FormControl({ value: null, disabled: true }),
      //quoting
      quotingRequirementsList: new FormArray<FormGroup<IQoutingRequirement>>(
        []
      ),
      // Policy Issuance

      // for get data only
      companyName: new FormControl(null),
      //activity Log
      salesActivityLogList: new FormArray<FormGroup<IActivityLog>>([]),
      //competitors
      salesLeadCompetitorsList: new FormArray<FormGroup<ICompetitors>>([]),
      //others
      branch: new FormControl(null),
      sendToUW: new FormControl(false),
      isPolicyRequierments: new FormControl(false), //
      isQuotingRequierments: new FormControl(false), //
      salesActivityLogChecked: new FormControl(false), //
      salesLeadCompetitorChecked: new FormControl(false), //
    });
  }
  get f() {
    return this.formGroup.controls;
  }
  changeToClient() {
    this.uiState.isClient = true;

    this.f.name?.reset();
    this.f.clientID?.reset();
  }
  changeToGroup() {
    this.uiState.isClient = false;

    this.f.name?.reset();
    this.f.clientID?.reset();
  }
  getClientId(e: any) {
    this.f.clientID?.patchValue(e?.id);
  }
  getLineOfBusiness(e: string) {
    let sub = this.businessDevService.lineOfBusiness(e).subscribe({
      next: (
        res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>
      ) => {
        this.lineOfBussArr = res.body?.data?.content!;
      },
      error: (err) => {
        this.message.popup("Sorry!", err.message!, "warning");
      },
    });
    this.subscribes.push(sub);
  }

  toggleDeadline(e: any) {
    if (e.target.checked) {
      this.f.deadLine?.enable();
      this.f.deadLine?.setValidators(Validators.required);
      this.f.deadLine?.updateValueAndValidity();
      this.f.chDeadline?.patchValue(1);
    } else {
      this.f.deadLine?.disable();
      this.f.deadLine?.clearValidators();
      this.f.deadLine?.updateValueAndValidity();
      this.f.deadLine?.reset();
      this.f.chDeadline?.patchValue(0);
    }
  }
  // is current insurance
  toggleCurInsured(e: any) {
    let controls = [
      this.f.existingPolExpDate,
      this.f.currentPolicyNo,
      this.f.currentBroker,
      this.f.currentInsurer,
      this.f.existingPolDetails,
    ];
    if (e.target.checked) {
      this.uiState.isCurrentIns = true;
      controls.forEach((c) => {
        c?.enable();
        c?.setValidators(Validators.required);
        c?.updateValueAndValidity();
      });
    } else {
      this.uiState.isCurrentIns = false;
      controls.forEach((c) => {
        c?.disable();
        c?.clearValidators();
        c?.reset();
        c?.updateValueAndValidity();
      });
    }
  }

  //#region requirment
  get quotingControlArray() {
    return this.formGroup.get("quotingRequirementsList") as FormArray;
  }
  quotingControls(i: number, control: string): AbstractControl {
    return this.quotingControlArray.controls[i].get(control)!;
  }

  getQuotRequirements() {
    if (
      this.f.companyName?.value &&
      this.f.classOfBusiness?.value &&
      this.f.lineOfBusiness?.value
    ) {
      let data = {
        className: this.f.classOfBusiness?.value,
        lineOfBusiness: this.f.lineOfBusiness?.value,
        companyName: this.f.companyName?.value,
      };
      let sub = this.businessDevService.quotRequirements(data).subscribe({
        next: (res: HttpResponse<IBaseResponse<IQoutingRequirement[]>>) => {
          if (res.body?.data) {
            this.uiState.quotingCompanyArr.push(...res.body?.data!);
            // console.log(this.uiState.quotingCompanyArr);
            this.createQuotingArray();
          }
        },
        error: (err: HttpErrorResponse) => {
          this.message.popup("Sorry!", err.message!, "warning");
        },
      });
      this.subscribes.push(sub);
    } else {
      this.message.toast(
        "Please Select \n Class of Insurance, Line of Business and Quoting Company",
        "warning"
      );
    }
  }

  createQuotingArray(data?: IQoutingRequirement) {
    let quoting = new FormGroup<any>({
      itemCheck: new FormControl(data?.itemCheck || false),
      insuranceCopmany: new FormControl(data?.insuranceCopmany || null),
      item: new FormControl(data?.item || null),
    });

    this.uiState.quotingCompanyArr?.forEach((el, i) => {
      this.quotingControlArray?.controls.forEach((c, j) => {
        if (i == j) {
          c?.get("insuranceCopmany")?.patchValue(el.insuranceCopmany);
          c?.get("item")?.patchValue(el.item);
        }
      });
      // quoting.reset();
      // quoting.get("insuranceCopmany")?.patchValue(el.insuranceCopmany);
      // quoting.get("item")?.patchValue(el?.item);
      this.f.quotingRequirementsList?.push(quoting);
      this.quotingControlArray.updateValueAndValidity();
    });
  }
  checkAllCompanies(e: any) {
    if (e.target.checked) {
      this.quotingControlArray?.controls?.forEach((c) => {
        c?.get("itemCheck")?.patchValue(true);
      });
    } else {
      this.quotingControlArray?.controls?.forEach((c) => {
        c?.get("itemCheck")?.patchValue(false);
      });
    }
  }
  //#endregion

  //#region  Activity Log
  get activityLogArray(): FormArray {
    return this.formGroup.get("salesActivityLogList") as FormArray;
  }

  activityLogControls(i: number, control: string): AbstractControl {
    return this.activityLogArray.controls[i].get(control)!;
  }

  addActivityLog(data?: IActivityLog) {
    if (this.f.salesActivityLogList?.invalid) {
      this.f.salesActivityLogList?.markAllAsTouched();
      return;
    }

    let activityLog = new FormGroup<IActivityLog>({
      logType: new FormControl(data?.logType || null, Validators.required),
      logDate: new FormControl(data?.logDate || null, Validators.required),
      logNotes: new FormControl(data?.logNotes || null, Validators.required),
    });

    !data ? activityLog.reset() : activityLog.disable();

    this.f.salesActivityLogList?.push(activityLog);
    this.activityLogArray.updateValueAndValidity();
  }
  //#endregion

  //#region  Competitors
  get competitorsArray(): FormArray {
    return this.formGroup.get("salesLeadCompetitorsList") as FormArray;
  }

  competitorControls(i: number, control: string): AbstractControl {
    return this.competitorsArray.controls[i].get(control)!;
  }

  addCompetitor(data?: ICompetitors) {
    if (this.f.salesLeadCompetitorsList?.invalid) {
      this.f.salesLeadCompetitorsList?.markAllAsTouched();
      return;
    }

    let competitor = new FormGroup<ICompetitors>({
      competitor: new FormControl(
        data?.competitor || null,
        Validators.required
      ),
      competitorNotes: new FormControl(data?.competitorNotes || null),
    });

    !data ? competitor.reset() : competitor.disable();

    this.f.salesLeadCompetitorsList?.push(competitor);
    this.competitorsArray.updateValueAndValidity();
  }
  //#endregion

  remove(i: number, type: string) {
    if (type === "competitor") this.competitorsArray.removeAt(i);
    else if (type === "activityLog") this.activityLogArray.removeAt(i);
    else return;
  }

  documentsList(e: File[]) {
    this.documentsToUpload = e;
  }
  validationChecker(): boolean {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (this.formGroup.invalid) return false;
    return true;
  }
  //#endregion edit
  taskDateFrom(e: any) {}
  taskDateTo(e: any) {}

  //#endregion

  submitForm(form: FormGroup<ISalesLeadForm>) {
    this.submitted = true;
    if (!this.validationChecker()) return;
    const formData = new FormData();
  }

  ngOnDestroy(): void {
    this.subscribes.forEach((sub) => sub.unsubscribe());
  }
}
