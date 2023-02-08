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
import { NgSelectComponent } from "@ng-select/ng-select";
import { HttpResponse } from "@angular/common/http";
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
  documentsToUpload: File[] = [];
  docs: any[] = [];
  lineOfBussArr: IGenericResponseType[] = [];
  quotingArr: IGenericResponseType[] = [];

  uiState = {
    isClient: true, // Choose client Or Group
    isDeadline: false,
    isCurrentIns: false,
  };
  @ViewChild("clintSelect") clintSelect!: NgSelectComponent;

  constructor(
    private tables: MasterTableService,
    private businessDevService: BusinessDevelopmentService,
    private message: MessagesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.formData = this.tables.getBaseData(MODULES.BusinessDevelopmentForm);
    this.formData.subscribe((res) => console.log(res));
  }

  initForm() {
    this.formGroup = new FormGroup<ISalesLeadForm>({
      leadType: new FormControl("New"),
      clientID: new FormControl(0, Validators.required),
      name: new FormControl(null, Validators.required),
      producer: new FormControl(null, Validators.required),
      classOfBusiness: new FormControl(null, Validators.required),
      lineOfBusiness: new FormControl(null, Validators.required),
      estimatedPremium: new FormControl(0),
      deadLine: new FormControl({ value: null, disabled: true }),
      chDeadline: new FormControl(0),
      chDeadlinebool: new FormControl(false),
      preferedInsurComapnies: new FormControl([]),
      policyDetails: new FormControl(null, Validators.required),
      existingPolExpDate: new FormControl({ value: null, disabled: true }),
      currentPolicyNo: new FormControl({ value: null, disabled: true }),
      currentBroker: new FormControl({ value: null, disabled: true }),
      currentInsurer: new FormControl({ value: null, disabled: true }),
      existingPolDetails: new FormControl({ value: null, disabled: true }),
      isPolicyRequierments: new FormControl(false), //
      isQuotingRequierments: new FormControl(false), //
      salesActivityLogChecked: new FormControl(false), //
      salesLeadCompetitorChecked: new FormControl(false), //
      salesLeadCompetitorsList: new FormArray<FormGroup<ICompetitors>>([]),
      salesActivityLogList: new FormArray<FormGroup<IActivityLog>>([]),
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
      this.uiState.isDeadline = true;
    } else {
      this.f.deadLine?.disable();
      this.f.deadLine?.clearValidators();
      this.f.deadLine?.updateValueAndValidity();
      this.f.deadLine?.reset();
      this.f.deadLine?.reset();
      this.f.chDeadline?.patchValue(0);
      this.uiState.isDeadline = false;
    }
  }
  getQuotingArr(e: any) {
    this.quotingArr = e;
  }

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

  // Competitors
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
    // this.competitorsArray.updateValueAndValidity();
    competitor.controls["competitor"]?.updateValueAndValidity();
    competitor.controls["competitorNotes"]?.updateValueAndValidity();
  }

  // Activity Log
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

  documentsList(e: any) {}
  submitForm() {
    this.submitted = true;
    console.log(this.f.existingPolExpDate?.invalid);
  }

  ngOnDestroy(): void {
    this.subscribes.forEach((sub) => sub.unsubscribe());
  }
}
