import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup, AbstractControl, FormArray, FormControl, Validators } from "@angular/forms";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";

import { Observable, Subscription } from "rxjs";

import { Caching, IBaseMasterTable, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";

import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";
import AppUtils from "src/app/shared/app/util";
import { IRequirementRequest } from "./../../../shared/app/models/BusinessDevelopment/irequirement";
import { AppRoutes } from "./../../../shared/app/routers/appRouters";
import { ISalesLeadDetails } from "./../../../shared/app/models/BusinessDevelopment/isalesLeadDetails";
import { MasterMethodsService } from "./../../../shared/services/master-methods.service";
import { IRequirement } from "../../../shared/app/models/BusinessDevelopment/irequirement";
import { IActivityLog } from "./../../../shared/app/models/BusinessDevelopment/iactivity-log";
import { ICompetitors } from "./../../../shared/app/models/BusinessDevelopment/icompetitors";
import { BusinessDevelopmentService } from "./../../../shared/services/business-development/business-development.service";
import { ISalesLeadForm } from "./../../../shared/app/models/BusinessDevelopment/isalesLeadForm";
import { SalesLeadStatus, SalesLeadType } from "src/app/shared/app/models/BusinessDevelopment/business-development-util";
import { ISalesleadTaskForm } from "src/app/shared/app/models/BusinessDevelopment/ibusiness-development-task-form";

@Component({
	selector: "app-business-forms",
	templateUrl: "./business-forms.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./business-forms.component.scss"],
})
export class BusinessFormsComponent implements OnInit, OnDestroy {
	formGroup!: FormGroup<ISalesLeadForm>;
	formData!: Observable<IBaseMasterTable>;
	leadType: typeof SalesLeadType = SalesLeadType;
	submitted: boolean = false;
	subscribes: Subscription[] = [];
	lineOfBussArr: IGenericResponseType[] = [];
	documentsToUpload: File[] = [];
	docs: any[] = [];

	uiState = {
		routes: {
			addClient: AppRoutes.Client.clientForms,
			addGroup: AppRoutes.Client.groups,
		},
		isClient: true, // Choose client Or Group
		editId: "",
		editMode: false,
		showTime: false,
	};
	@ViewChild("dropzone") dropzone!: any;

	constructor(
		private tables: MasterTableService,
		private businessDevService: BusinessDevelopmentService,
		private masterService: MasterMethodsService,
		private message: MessagesService,
		private route: ActivatedRoute,
		private utils: AppUtils,
		private router: Router,
		private eventService: EventService
	) {}

	ngOnInit(): void {
		this.initForm();
		this.formData = this.tables.getBaseData(MODULES.BusinessDevelopmentForm);
		this.route.paramMap.subscribe((res) => {
			if (res.get("id")) {
				this.uiState.editId = res.get("id")!;
				this.uiState.editMode = true;
				this.getSalesLead(this.uiState.editId);
			}
		});
	}
	//#region form
	initForm() {
		this.formGroup = new FormGroup<ISalesLeadForm>({
			//lead details
			leadType: new FormControl(this.leadType.New),
			clientID: new FormControl(0, Validators.required),
			name: new FormControl(null, Validators.required),
			producer: new FormControl(null, Validators.required),
			//insurance details
			classOfBusiness: new FormControl(null, Validators.required),
			lineOfBusiness: new FormControl(null, Validators.required),
			estimatedPremium: new FormControl(null),
			deadLine: new FormControl({ value: null, disabled: true }, Validators.required),
			chDeadlinebool: new FormControl(false),
			preferedInsurComapnies: new FormControl([]),
			policyDetails: new FormControl(null, Validators.required),
			//currently insurance
			chCurrentInsurer: new FormControl(false),
			existingPolExpDate: new FormControl({ value: null, disabled: true }, Validators.required),
			currentPolicyNo: new FormControl({ value: null, disabled: true }, Validators.required),
			currentBroker: new FormControl({ value: null, disabled: true }, Validators.required),
			currentInsurer: new FormControl({ value: null, disabled: true }),
			existingPolDetails: new FormControl({ value: null, disabled: true }, Validators.required),
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
			branch: new FormControl("Riyadh", Validators.required),
			sendToUW: new FormControl(false),
			// for edit
			leadNo: new FormControl(""),
			// New Tasks Activities Form Array

			salesLeadTasks: new FormArray<FormGroup<ISalesleadTaskForm>>([]),
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

	toggleDeadline() {
		if (this.f.chDeadlinebool?.value) {
			this.f.deadLine?.enable();
		} else {
			this.f.deadLine?.disable();
			this.f.deadLine?.reset();
		}
	}
	//#endregion

	//#region  current insurance
	get currentInsControls() {
		return [this.f.existingPolExpDate, this.f.currentPolicyNo, this.f.currentBroker, this.f.currentInsurer, this.f.existingPolDetails];
	}
	toggleCurInsured() {
		if (this.f.chCurrentInsurer?.value) {
			this.currentInsControls.forEach((c) => {
				c?.enable();
			});
		} else {
			this.currentInsControls.forEach((c) => {
				c?.disable();
				c?.reset();
			});
		}
	}
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
			companyName: name == "quoting" ? this.f.companyNameQuot?.value : name == "policy" ? this.f.companyNamePol?.value : "",
		};

		name == "quoting" ? this.getQuotingReq(data) : name == "policy" ? this.getPolicyReq(data) : "";
	}

	checkCompanyExist(requirementList: any, value?: string): IRequirement {
		return requirementList.find((el: IRequirement) => el.insuranceCopmany == value);
	}

	getQuotingReq(data: IRequirementRequest) {
		let check = this.checkCompanyExist(this.f?.quotingRequirementsList?.value, data.companyName!);
		if (!check) {
			let sub = this.businessDevService.quotRequirements(data).subscribe(
				(res: HttpResponse<IBaseResponse<IRequirement[]>>) => {
					res.body?.data?.map((c) => this.createReqFormArr("quoting", c));
				},
				(err: HttpErrorResponse) => {
					this.message.popup("Sorry!", err.message!, "warning");
				}
			);
			this.subscribes.push(sub);
		} else {
			this.message.popup("Sorry!", "Company is already exist");
		}
	}

	getPolicyReq(data: IRequirementRequest) {
		let check = this.checkCompanyExist(this.f?.policyRequiermentsList?.value, data.companyName!);
		if (!check) {
			let sub = this.businessDevService.policyRequirements(data).subscribe(
				(res: HttpResponse<IBaseResponse<IRequirement[]>>) => {
					res.body?.data?.map((c) => this.createReqFormArr("policy", c));
				},
				(err: HttpErrorResponse) => {
					this.message.popup("Sorry!", err.message!, "warning");
				}
			);
			this.subscribes.push(sub);
		} else {
			this.message.popup("Sorry!", "Company is already exist");
		}
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
			activityLog.get("logDate")?.patchValue(this.utils.dateStructFormat(data?.logDate) as any);
			activityLog.disable();
		} else activityLog.reset();

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
			competitor: new FormControl(data?.competitor || null, Validators.required),
			competitorNotes: new FormControl(data?.competitorNotes || null),
		});

		!data ? competitor.reset() : competitor.disable();

		this.f.salesLeadCompetitorsList?.push(competitor);
		this.competitorsArray.updateValueAndValidity();
	}
	//#endregion

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

	documentsList(e: File[]) {
		this.documentsToUpload = e;
	}

	//#endregion

	// #region edit
	getSalesLead(id: string) {
		this.eventService.broadcast(reserved.isLoading, true);
		let sub = this.businessDevService.getSalesLeadById(id).subscribe(
			(res: HttpResponse<IBaseResponse<ISalesLeadDetails>>) => {
				if (res.body?.status) {
					this.eventService.broadcast(reserved.isLoading, false);
					this.patchValuesWhenEdit(res.body?.data!);
				} else {
					this.eventService.broadcast(reserved.isLoading, false);
					this.message.popup("Sorry!", res.body?.message!, "error");
				}
			},
			(err: HttpErrorResponse) => {
				this.eventService.broadcast(reserved.isLoading, false);
				this.message.popup("Error", err.message!, "error");
			}
		);
		this.subscribes.push(sub);
	}

	patchValuesWhenEdit(salesLead: ISalesLeadDetails) {
		this.uiState.editId = salesLead.sNo?.toString()!;
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
			deadLine: salesLead.deadLine ? (this.utils.dateStructFormat(salesLead.deadLine) as any) : "",
			preferedInsurComapnies: salesLead?.preferedInsurComapnies,
			policyDetails: salesLead?.policyDetails,
			// currently insured
			chCurrentInsurer: salesLead.chCurrentInsurer,
			existingPolExpDate: salesLead.existingPolExpDate ? (this.utils.dateStructFormat(salesLead.existingPolExpDate) as any) : "",
			currentPolicyNo: salesLead?.currentPolicyNo,
			currentBroker: salesLead?.currentBroker,
			currentInsurer: salesLead.currentInsurer,
			existingPolDetails: salesLead?.existingPolDetails,
			// others
			sendToUW: salesLead.sendToUW,
			branch: salesLead.branch,
			// for edit
			leadNo: salesLead.leadNo,
		});

		this.getLineOfBusiness(salesLead.classOfBusiness!);

		// to checked chDeadlineBool
		if (salesLead.chDeadline == 1) {
			this.f.chDeadlinebool?.patchValue(true);
			this.f.deadLine?.enable();
		}
		// to enable currently insured inputs
		if (salesLead.chCurrentInsurer) {
			this.currentInsControls.forEach((c) => {
				c?.enable();
			});
		}

		// quoting requirement
		salesLead.quotingRequirementsList?.forEach((el) => this.createReqFormArr("quoting", el));

		// policy requirement
		salesLead.policyRequiermentsList?.forEach((el) => this.createReqFormArr("policy", el));

		// activity Log
		salesLead.salesActivityLogList?.forEach((el) => {
			this.addActivityLog(el);
		});

		// competitors
		salesLead.salesLeadCompetitorsList?.forEach((el) => this.addCompetitor(el));

		// documents
		this.docs = salesLead.documentList!;

		// sentToUW
		if (salesLead.sendToUW) this.f.sendToUW?.disable();
	}

	//#endregion

	// #region tasks
	get salesLeadTasksArray() {
		return this.formGroup.get("salesLeadTasks") as FormArray;
	}
	salesleadTasksControls(i: number, control: string): AbstractControl {
		return this.salesLeadTasksArray.controls[i].get(control)!;
	}

	addTask(data?: ISalesleadTaskForm) {
		if (this.f.salesLeadTasks?.invalid) {
			this.f.salesLeadTasks?.markAllAsTouched();
			return;
		}

		let task = new FormGroup<ISalesleadTaskForm>({
			allDay: new FormControl(null),
			Module: new FormControl(null),
			ModuleSNo: new FormControl(null),
			ClientName: new FormControl(null),
			Type: new FormControl(null),
			DueDateFrom: new FormControl(null),
			DueDateTo: new FormControl(null),
			TaskName: new FormControl(null),
			TaskDetails: new FormControl(null),
			AssignedTo: new FormControl(null),
		});
		// for edit
		if (data) {
			task.get("DueDateFrom")?.patchValue(this.utils.dateStructFormat(data?.DueDateFrom) as any);
			task.get("DueDateTo")?.patchValue(this.utils.dateStructFormat(data?.DueDateTo) as any);
			task.disable();
		} else task.reset();

		this.f.salesLeadTasks?.push(task);
		this.salesLeadTasksArray.updateValueAndValidity();
	}

	dateRange(e: { from: any; to: any }) {
		if (e.from && e.to) this.uiState.showTime = false;
		else this.uiState.showTime = true;
	}
	//#endregion

	//#region save Sales Lead
	saveSalesLead(data: FormData): void {
		let sub = this.businessDevService.saveSalesLead(data).subscribe(
			(res: HttpResponse<IBaseResponse<number>>) => {
				if (res.body?.status) {
					this.message.toast(res.body.message!, "success");
					if (this.uiState.editMode) {
						this.router.navigate([AppRoutes.BusinessDevelopment.base]);
					}
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
		let salesLeadForm = form.getRawValue();
		this.submitted = true;
		if (!this.validationChecker()) return;
		this.eventService.broadcast(reserved.isLoading, true);
		const formData = new FormData();

		if (this.uiState.editId) {
			formData.append("sNo", this.uiState.editId);
			formData.append("LeadNo", salesLeadForm.leadNo!);
		}
		// lead type
		formData.append("LeadType", salesLeadForm?.leadType!);
		formData.append("ClientID", salesLeadForm?.clientID?.toString()!);
		formData.append("Name", salesLeadForm?.name!);
		formData.append("Producer", salesLeadForm?.producer!);
		// insurance details
		formData.append("ClassOfBusiness", salesLeadForm?.classOfBusiness!);
		formData.append("LineOfBusiness", salesLeadForm?.lineOfBusiness!);
		formData.append("EstimatedPremium", salesLeadForm?.estimatedPremium !== null ? salesLeadForm?.estimatedPremium?.toString()! : "0");
		formData.append("ChDeadlinebool", salesLeadForm?.chDeadlinebool?.toString()!); // boolean //check
		formData.append("DeadLine", this.utils.dateFormater(salesLeadForm?.deadLine!));

		salesLeadForm?.preferedInsurComapnies?.forEach((el, i) => {
			formData.append(`PreferedInsurComapnies[${i}]`, el);
		});

		formData.append("PolicyDetails", salesLeadForm?.policyDetails!);

		// currently insured
		formData.append("ExistingPolExpDate", this.utils.dateFormater(salesLeadForm?.existingPolExpDate));
		formData.append("CurrentPolicyNo", salesLeadForm?.currentPolicyNo! ? salesLeadForm?.currentPolicyNo! : "");
		formData.append("CurrentBroker", salesLeadForm?.currentBroker! ? salesLeadForm?.currentBroker! : "");
		formData.append("CurrentInsurer", salesLeadForm?.currentInsurer! ? salesLeadForm?.currentInsurer! : "");
		formData.append("ExistingPolDetails", salesLeadForm?.existingPolDetails! ? salesLeadForm?.existingPolDetails! : "");

		// quoting requirement array
		salesLeadForm.quotingRequirementsList?.forEach((el, i) => {
			formData.append(`QuotingRequirementsList[${i}].itemCheck`, el.itemCheck?.toString()!); // boolean
			formData.append(`QuotingRequirementsList[${i}].insuranceCopmany`, el.insuranceCopmany!);
			formData.append(`QuotingRequirementsList[${i}].item`, el.item!);
		});

		// policy requirement array

		salesLeadForm.policyRequiermentsList?.forEach((el, i) => {
			formData.append(`PolicyRequiermentsList[${i}].itemCheck`, el.itemCheck?.toString()!);
			formData.append(`PolicyRequiermentsList[${i}].insuranceCopmany`, el.insuranceCopmany!);
			formData.append(`PolicyRequiermentsList[${i}].item`, el.item!);
		});

		// activity log array
		salesLeadForm.salesActivityLogList?.forEach((el, i) => {
			formData.append(`SalesActivityLogList[${i}].logType`, el.logType!);
			formData.append(`SalesActivityLogList[${i}].logDate`, this.utils.dateFormater(el.logDate));
			formData.append(`SalesActivityLogList[${i}].logNotes`, el.logNotes!);
		});

		// competitors array with check
		salesLeadForm.salesLeadCompetitorsList?.forEach((el, i) => {
			formData.append(`SalesLeadCompetitorsList[${i}].competitor`, el.competitor!);
			formData.append(`SalesLeadCompetitorsList[${i}].competitorNotes`, el.competitorNotes ? el.competitorNotes : "");
		});

		// document array
		this.documentsToUpload.forEach((el) => formData.append("Documents", el));

		// others
		formData.append("SendToUW", salesLeadForm?.sendToUW?.toString()!); // boolean
		if (salesLeadForm.sendToUW) formData.append("Status", SalesLeadStatus.PendingwithUnderwriting);
		formData.append("Branch", salesLeadForm?.branch!);

		this.saveSalesLead(formData);
	}
	//#endregion

	ngOnDestroy(): void {
		this.subscribes.forEach((sub) => sub.unsubscribe());
	}
}
