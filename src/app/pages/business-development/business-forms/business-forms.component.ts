import { ISalesLeadDetails } from "./../../../shared/app/models/BusinessDevelopment/isalesLeadDetails";
import { MasterMethodsService } from "./../../../shared/services/master-methods.service";
import { IRequirement } from "../../../shared/app/models/BusinessDevelopment/irequirement";
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
import { EventService } from "src/app/core/services/event.service";
import { ActivatedRoute } from "@angular/router";
import { reserved } from "src/app/core/models/reservedWord";
import AppUtils from "src/app/shared/app/util";

@Component({
  selector: "app-business-forms",
  templateUrl: "./business-forms.component.html",
  styleUrls: ["./business-forms.component.scss"],
  providers: [AppUtils],
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
    editId: "",
  };
  @ViewChild("dropzone") dropzone!: any;

  constructor(
    private tables: MasterTableService,
    private businessDevService: BusinessDevelopmentService,
    private masterService: MasterMethodsService,
    private message: MessagesService,
    private route: ActivatedRoute,
    private utils: AppUtils,

    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.formData = this.tables.getBaseData(MODULES.BusinessDevelopmentForm);
    this.route.paramMap.subscribe((res) => {
      if (res.get("id")) {
        this.uiState.editId = res.get("id")!;
        this.getSalesLead(this.uiState.editId);
        // this.eventService.broadcast(reserved.isLoading, true);
      }
    });
  }
  //#region form
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
      estimatedPremium: new FormControl(null),
      deadLine: new FormControl({ value: null, disabled: true }),
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
      quotingRequirementsList: new FormArray<FormGroup<IRequirement>>([]),
      // Policy Issuance
      policyRequiermentsList: new FormArray<FormGroup<IRequirement>>([]),
      // for get data only
      companyNameQuot: new FormControl(null),
      companyNamePol: new FormControl(null),
      //activity Log
      salesActivityLogList: new FormArray<FormGroup<IActivityLog>>([]),
      //competitors
      salesLeadCompetitorsList: new FormArray<FormGroup<ICompetitors>>([]),
      //others
      branch: new FormControl(null),
      sendToUW: new FormControl(false),
    });
  }
  get f() {
    return this.formGroup.controls;
  }
  //#endregion

  //#region leadType
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

  //#endregion

  //#region insurance Details
  getLineOfBusiness(className: string) {
    let sub = this.masterService.getLineOfBusiness(className).subscribe(
      (res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>) => {
        this.lineOfBussArr = res.body?.data?.content!;
      },
      (err) => {
        this.message.popup("Sorry!", err.message!, "warning");
      }
    );
    this.subscribes.push(sub);
  }

  toggleDeadline(e: any) {
    if (e.target.checked) {
      this.f.deadLine?.enable();
      this.f.deadLine?.setValidators(Validators.required);
      this.f.deadLine?.updateValueAndValidity();
    } else {
      this.f.deadLine?.disable();
      this.f.deadLine?.clearValidators();
      this.f.deadLine?.updateValueAndValidity();
      this.f.deadLine?.reset();
    }
  }
  //#endregion

  //#region  current insurance
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

  // polExpiryDates(e: { gon: any; hijri: any }) {
  //   this.f.existingPolExpDate?.patchValue(e.gon);
  // }
  //#endregion

  //#region requirment
  get quotingControlArray() {
    return this.formGroup.get("quotingRequirementsList") as FormArray;
  }
  quotingControls(i: number, control: string): AbstractControl {
    return this.quotingControlArray.controls[i].get(control)!;
  }
  get policyControlArray() {
    return this.formGroup.get("policyRequiermentsList") as FormArray;
  }
  policyControls(i: number, control: string): AbstractControl {
    return this.policyControlArray.controls[i].get(control)!;
  }

  getRequirements(name: string): void {
    let data = {
      className: this.f.classOfBusiness?.value,
      lineOfBusiness: this.f.lineOfBusiness?.value,
      companyName:
        name == "quoting"
          ? this.f.companyNameQuot?.value
          : name == "policy"
          ? this.f.companyNamePol?.value
          : "",
    };

    name == "quoting"
      ? this.getQuotingReq(data)
      : name == "policy"
      ? this.getPolicyReq(data)
      : "";
  }
  getQuotingReq(data: {}) {
    let sub = this.businessDevService.quotRequirements(data).subscribe(
      (res: HttpResponse<IBaseResponse<IRequirement[]>>) => {
        res.body?.data?.map((c) => this.createReqFormArr("quoting", c));
      },
      (err: HttpErrorResponse) => {
        this.message.popup("Sorry!", err.message!, "warning");
      }
    );
    this.subscribes.push(sub);
  }
  getPolicyReq(data: {}) {
    let sub = this.businessDevService.policyRequirements(data).subscribe(
      (res: HttpResponse<IBaseResponse<IRequirement[]>>) => {
        res.body?.data?.map((c) => this.createReqFormArr("policy", c));
      },
      (err: HttpErrorResponse) => {
        this.message.popup("Sorry!", err.message!, "warning");
      }
    );
    this.subscribes.push(sub);
  }

  createReqFormArr(name: string, data?: IRequirement) {
    let formArrayCon = new FormGroup<IRequirement>({
      itemCheck: new FormControl(data?.itemCheck || false),
      insuranceCopmany: new FormControl(data?.insuranceCopmany || null),
      item: new FormControl(data?.item || null),
    });
    if (name == "quoting") {
      this.f.quotingRequirementsList?.push(formArrayCon);
      this.quotingControlArray.updateValueAndValidity();
    } else if (name == "policy") {
      this.f.policyRequiermentsList?.push(formArrayCon);
      this.policyControlArray.updateValueAndValidity();
    } else {
      return;
    }
  }

  checkAllCompaniesQuot(e: any) {
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
  checkAllCompaniesPol(e: any) {
    if (e.target.checked) {
      this.policyControlArray?.controls?.forEach((c) => {
        c?.get("itemCheck")?.patchValue(true);
      });
    } else {
      this.policyControlArray?.controls?.forEach((c) => {
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
    // for edit
    if (data) {
      activityLog
        .get("logDate")
        ?.patchValue(this.utils.dateStructFormat(data?.logDate) as any);
      activityLog.disable();
    } else {
      activityLog.reset();
    }

    this.f.salesActivityLogList?.push(activityLog);
    this.activityLogArray.updateValueAndValidity();
  }

  // activityLogDate(e: { gon: any; hijri: any }, i: number) {
  //   this.activityLogControls(i, "logDate").patchValue(e.gon);
  // }
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

  documentsList(e: File[]) {
    this.documentsToUpload = e;
  }

  //#endregion

  // #region edit
  getSalesLead(id: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.businessDevService.getSalesLeadById(id).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) => {
        console.log(res.body!);
        if (res.body?.status) {
          this.eventService.broadcast(reserved.isLoading, false);
          this.patchValuesWhenEdit(res.body?.data);
        } else {
          this.eventService.broadcast(reserved.isLoading, false);
          this.message.popup("Sorry!", res.body?.message!, "error");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.eventService.broadcast(reserved.isLoading, false);
        this.message.popup("Error", err.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  patchValuesWhenEdit(salesLead: ISalesLeadDetails) {
    this.uiState.editId = salesLead.sNo.toString();
    this.formGroup.patchValue({
      // lead details
      leadType: salesLead.leadType,
      clientID: salesLead?.clientID,
      name: salesLead?.name,
      producer: salesLead?.producer,
      // insurance details
      classOfBusiness: salesLead?.classOfBusiness,
      lineOfBusiness: salesLead?.lineOfBusiness,
      estimatedPremium: salesLead?.estimatedPremium,
      chDeadlinebool: salesLead?.chDeadlinebool,
      deadLine: this.utils.dateStructFormat(salesLead.deadLine) as any, //
      preferedInsurComapnies: salesLead?.preferedInsurComapnies,
      policyDetails: salesLead?.policyDetails,
      // currently insured
      existingPolExpDate: this.utils.dateStructFormat(
        salesLead.existingPolExpDate
      ) as any,
      currentPolicyNo: salesLead?.currentPolicyNo,
      currentBroker: salesLead?.currentBroker,
      currentInsurer: salesLead.currentInsurer,
      existingPolDetails: salesLead?.existingPolDetails,
      // others
      sendToUW: salesLead.sendToUW,
      branch: salesLead.branch,
      // for edit
      sNo: salesLead.sNo,
      leadNo: salesLead.leadNo,
    });

    // quoting requirement
    salesLead.quotingRequirementsList?.forEach((el) =>
      this.createReqFormArr("quoting", el)
    );

    // policy requirement
    salesLead.policyRequiermentsList?.forEach((el) =>
      this.createReqFormArr("policy", el)
    );

    // activity Log
    salesLead.salesActivityLogList?.forEach((el) => {
      this.addActivityLog(el);
    });

    // competitors
    salesLead.salesLeadCompetitorsList?.forEach((el) => this.addCompetitor(el));

    // documents
    this.docs = salesLead.documentList!;
  }

  dateRange(e: { from: any; to: any }) {
    console.log(e.from);
    console.log(e.to);
  }

  // remove and edit inputs array form activity log and competitor
  toggleBtn(i: number, name: string, isEdit: boolean) {
    switch (isEdit) {
      case true:
        if (name === "competitor") this.competitorsArray.at(i).enable();
        else if (name === "activityLog") this.activityLogArray.at(i).enable();
        break;
      case false:
        if (name === "competitor") this.competitorsArray.removeAt(i);
        else if (name === "activityLog") this.activityLogArray.removeAt(i);
        break;
      default:
        break;
    }
  }
  //#endregion

  //#region save Sales Lead
  saveSalesLead(data: FormData): void {
    let sub = this.businessDevService.saveSalesLead(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.message.toast(res.body.message!, "success");
          this.resetForm();
          this.eventService.broadcast(reserved.isLoading, false);
        } else {
          this.eventService.broadcast(reserved.isLoading, false);
          this.message.popup("Sorry!", res.body?.message!, "warning");
        }
      },
      (err) => {
        this.message.popup("Error", err.message, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  validationChecker(): boolean {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (this.formGroup.invalid) return false;
    return true;
  }
  resetForm(): void {
    this.formGroup.reset();
    this.f.quotingRequirementsList?.clear();
    this.f.policyRequiermentsList?.clear();
    this.f.salesActivityLogList?.clear();
    this.f.salesLeadCompetitorsList?.clear();
    this.submitted = false;
  }

  submitForm(form: FormGroup<ISalesLeadForm>) {
    this.submitted = true;
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    const formData = new FormData();

    if (this.uiState.editId) {
      formData.append("sNo", this.uiState.editId);
      formData.append("LeadNo", form.value.leadNo!);
    }
    // lead type
    formData.append("LeadType", form.value?.leadType!);
    formData.append("ClientID", form.value?.clientID?.toString()!);
    formData.append("Name", form.value?.name!);
    formData.append("Producer", form.value?.producer!);
    // insurance details
    formData.append("ClassOfBusiness", form.value?.classOfBusiness!);
    formData.append("LineOfBusiness", form.value?.lineOfBusiness!);
    formData.append(
      "EstimatedPremium",
      form.value?.estimatedPremium !== null
        ? form.value?.estimatedPremium?.toString()!
        : "0"
    );
    formData.append("ChDeadlinebool", form.value?.chDeadlinebool?.toString()!); // boolean //check
    formData.append("DeadLine", this.utils.dateFormater(form.value?.deadLine!));
    form.value?.preferedInsurComapnies?.forEach((el, i) => {
      formData.append(`PreferedInsurComapnies[${i}]`, el);
    });
    formData.append("PolicyDetails", form.value?.policyDetails!);

    // currently insured
    formData.append(
      "ExistingPolExpDate",
      this.utils.dateFormater(form.value?.existingPolExpDate)
    );
    formData.append(
      "CurrentPolicyNo",
      form.value?.currentPolicyNo! ? form.value?.currentPolicyNo! : ""
    );
    formData.append(
      "CurrentBroker",
      form.value?.currentBroker! ? form.value?.currentBroker! : ""
    );
    formData.append(
      "CurrentInsurer",
      form.value?.currentInsurer! ? form.value?.currentInsurer! : ""
    );
    formData.append(
      "ExistingPolDetails",
      form.value?.existingPolDetails! ? form.value?.existingPolDetails! : ""
    );

    // quoting requirement array
    form.value.quotingRequirementsList?.forEach((el, i) => {
      formData.append(
        `QuotingRequirementsList[${i}].itemCheck`,
        el.itemCheck?.toString()!
      ); // boolean
      formData.append(
        `QuotingRequirementsList[${i}].insuranceCopmany`,
        el.insuranceCopmany!
      );
      formData.append(
        `QuotingRequirementsList[${i}].insuranceCopmany`,
        el.item!
      );
    });

    // policy requirement array
    form.value.policyRequiermentsList?.forEach((el, i) => {
      formData.append(
        `PolicyRequiermentsList[${i}].itemCheck`,
        el.itemCheck?.toString()!
      ); // boolean
      formData.append(
        `PolicyRequiermentsList[${i}].insuranceCopmany`,
        el.insuranceCopmany!
      );
      formData.append(`PolicyRequiermentsList[${i}].item`, el.item!);
    });

    // activity log array with check
    form.value.salesActivityLogList?.forEach((el, i) => {
      formData.append(`SalesActivityLogList[${i}].logType`, el.logType!);
      formData.append(
        `SalesActivityLogList[${i}].logDate`,
        this.utils.dateFormater(el.logDate)
      );
      formData.append(`SalesActivityLogList[${i}].logNotes`, el.logNotes!);
    });
    formData.append(
      "SalesActivityLogChecked",
      form.value.salesActivityLogList?.length !== 0 ? "true" : "false"
    );

    // competitors array with check
    form.value.salesLeadCompetitorsList?.forEach((el, i) => {
      formData.append(
        `SalesLeadCompetitorsList[${i}].competitor`,
        el.competitor!
      );
      formData.append(
        `SalesLeadCompetitorsList[${i}].competitorNotes`,
        el.competitorNotes!
      );
    });
    formData.append(
      "SalesLeadCompetitorChecked",
      form.value.salesLeadCompetitorsList?.length !== 0 ? "true" : "false"
    );

    // document array
    this.documentsToUpload.forEach((el) => formData.append("Documents", el));

    // others
    formData.append("SendToUW", form.value?.sendToUW?.toString()!); // boolean
    formData.append("Branch", form.value?.branch!);

    this.saveSalesLead(formData);
  }
  //#endregion

  ngOnDestroy(): void {
    this.subscribes.forEach((sub) => sub.unsubscribe());
  }
}
