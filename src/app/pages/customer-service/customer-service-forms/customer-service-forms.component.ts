import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import AppUtils from "src/app/shared/app/util";
import { ActivatedRoute, Router } from "@angular/router";
import { MessagesService } from "src/app/shared/services/messages.service";
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { ICSForm } from "src/app/shared/app/models/CustomerService/icustomer-service-form";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CustomerServiceService } from "src/app/shared/services/customer-service/customer-service.service";
import { CSPolicyData } from "src/app/shared/app/models/CustomerService/icustomer-service-policy";
import { CustomerServiceListComponent } from "../customer-service-list/customer-service-list.component";
import { CustomerServiceStatus, EndorsTypeByPolicy, RequiermentsList } from "src/app/shared/app/models/CustomerService/icustomer-service-utils";
import { ICustomerService } from "src/app/shared/app/models/CustomerService/icustomer-service";

@Component({
	selector: "app-customer-service-forms",
	templateUrl: "./customer-service-forms.component.html",
	styleUrls: ["./customer-service-forms.component.scss"],
})
export class CustomerServiceFormsComponent implements OnInit {
	submitted = false;
	formData!: Observable<IBaseMasterTable>;
	formGroup!: FormGroup<ICSForm>;
	documentsToUpload: File[] = [];
	docs: any[] = [];
	@ViewChild(CustomerServiceListComponent)
	dataSource!: CustomerServiceListComponent;
	subscribes: Subscription[] = [];
	requestStatus: any = CustomerServiceStatus;

	uiState = {
		editMode: false,
		editId: "",
		date: new Date(),
		editRequestData: {} as ICustomerService,
		requestDetailsFromClient: {} as CSPolicyData,
		policyList: {
			list: [] as CSPolicyData[],
			totalPages: 0,
		},
		endorsTypes: [] as EndorsTypeByPolicy[],
	};

	@ViewChild("dropzone") dropzone!: any;
	@ViewChild("checkAllRequierments") checkAllRequierments!: ElementRef;

	constructor(
		private route: ActivatedRoute,
		private message: MessagesService,
		private tables: MasterTableService,
		private customerService: CustomerServiceService,
		private util: AppUtils,
		private eventService: EventService,
		private modalService: NgbModal
	) {}

	ngOnInit(): void {
		this.initForm();
		this.initSearchClientForm();
		this.formData = this.tables.getBaseData(MODULES.CustomerServiceForm);

		let sub = this.route.paramMap.subscribe((res) => {
			if (res.get("id")) {
				this.uiState.editId = res.get("id")!;
				this.eventService.broadcast(reserved.isLoading, true);
				this.uiState.editMode = true;
				this.getRequest(this.uiState.editId);
			}
		});
		this.subscribes.push(sub);
	}

	getRequest(id: string): void {
		this.customerService.getRequest(id).subscribe(
			(res: HttpResponse<IBaseResponse<ICustomerService>>) => {
				if (res.body?.status) this.setRequestDataToForm(res.body?.data!);
				else this.message.popup("Oops!", res.body?.message!, "warning");
			},
			(err) => {
				this.message.popup("Oops!", err?.message, "error");
				this.eventService.broadcast(reserved.isLoading, false);
			}
		);
	}

	setRequestDataToForm(data: ICustomerService) {
		console.log(data);
		this.f.clientName?.patchValue(data.clientName!);
		this.f.clientID?.patchValue(data.clientId!);
		this.f.requestNo?.patchValue(data.requestNo!);
		this.f.branch?.patchValue(data.branch!);
		this.f.endorsType?.patchValue(data.endorsType!);
		this.f.policyNo?.patchValue(data.policyNo!);
		this.f.classOfBusiness?.patchValue(data.classOfBusiness!);
		this.f.lineOfBusiness?.patchValue(data.lineOfBusiness!);
		this.f.insurComp?.patchValue(data.insurComp!);
		this.f.existingPolExpDate?.patchValue(this.util.dateStructFormat(data.existingPolExpDate!) as any);
		this.f.netPremium?.patchValue(data.netPremium!);
		this.f.policyFees?.patchValue(data.policyFees!);
		this.f.vatPerc?.patchValue(data.vatPerc!);
		this.f.vatValue?.patchValue(data.vatValue!);
		this.f.dateOfDeadline?.patchValue(this.util.dateStructFormat(data.dateOfDeadline!) as any);
		this.f.requestDetails?.patchValue(data.requestDetails!);
		this.docs = data.documentLists!;
		data.requiermentsList!.forEach((req) => this.addReq(req));
		this.eventService.broadcast(reserved.isLoading, false);
	}

	addReq(req: any) {
		let request = new FormGroup<RequiermentsList>({
			itemCheck: new FormControl(req.checked || null),
			itemValue: new FormControl(req.item || null),
		});
		this.f.requiermentsList?.push(request);
		this.requirmentsChecker();
	}

	//#region Search Client Modal

	searchClientModal!: NgbModalRef;
	searchClientForm!: FormGroup;
	searchClientFormSubmitted: boolean = false;

	openSearchClientDialoge(content: TemplateRef<any>) {
		this.searchClientForm.reset();
		this.searchClientModal = this.modalService.open(content, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
			backdrop: "static",
			size: "xl",
		});

		this.searchClientModal.hidden.subscribe(() => {
			this.searchClientForm.reset();
			this.searchClientFormSubmitted = false;
		});
	}

	initSearchClientForm(): void {
		this.searchClientForm = new FormGroup({
			policyNo: new FormControl("", Validators.required),
			insuranceCompName: new FormControl("", Validators.required),
			clientNo: new FormControl(0, Validators.required),
		});
	}

	get ff() {
		return this.searchClientForm.controls;
	}

	deadlineDate(e: any) {
		this.f.dateOfDeadline?.patchValue(e.gon);
		this.f.dateOfDeadline?.patchValue(e.gon);
		e.gon = {
			day: e.gon.day - 1,
			month: e.gon.month,
			year: e.gon.year + 1,
		};
		this.f.dateOfDeadline?.patchValue(e.gon);
	}

	expiryDate(e: any) {
		this.f.existingPolExpDate?.patchValue(e.gon);
		this.f.existingPolExpDate?.patchValue(e.gon);
		e.gon = {
			day: e.gon.day - 1,
			month: e.gon.month,
			year: e.gon.year + 1,
		};
		this.f.existingPolExpDate?.patchValue(e.gon);
	}

	fillCSFormData(e: CSPolicyData) {
		this.modalService.dismissAll();
		this.uiState.requestDetailsFromClient = e;
		this.formGroup.patchValue({
			clientID: this.uiState.requestDetailsFromClient.clientNo!,
			clientName: this.uiState.requestDetailsFromClient.clientName!,
			producer: this.uiState.requestDetailsFromClient.producer!,
			classOfBusiness: this.uiState.requestDetailsFromClient.className!,
			policyNo: this.uiState.requestDetailsFromClient.policyNo!,
			lineOfBusiness: this.uiState.requestDetailsFromClient.insurComp!,
			dateOfDeadline: this.util.dateStructFormat(new Date().toLocaleDateString()) as any,
			existingPolExpDate: this.util.dateStructFormat(this.uiState.requestDetailsFromClient.periodTo!) as any,
		});
	}

	//#endregion

	initForm(): void {
		this.formGroup = new FormGroup<ICSForm>({
			clientID: new FormControl(null, Validators.required),
			clientName: new FormControl(null, Validators.required),
			producer: new FormControl(null, Validators.required),
			endorsType: new FormControl(null, Validators.required),
			classOfBusiness: new FormControl(null, Validators.required),
			requestNo: new FormControl(null, Validators.required),
			netPremium: new FormControl(null),
			policyNo: new FormControl(null, Validators.required),
			lineOfBusiness: new FormControl(null, Validators.required),
			policyFees: new FormControl(null, Validators.required),
			insurComp: new FormControl(null, Validators.required),
			dateOfDeadline: new FormControl(null),
			vatPerc: new FormControl(null),
			vatValue: new FormControl(null),
			existingPolExpDate: new FormControl(null, Validators.required),
			requestDetails: new FormControl(null),
			totalPremium: new FormControl(null),
			cSSpecialConditions: new FormControl(null),
			branch: new FormControl(null),
			requiermentsList: new FormArray<FormGroup<RequiermentsList>>([]),
		});
	}

	get f() {
		return this.formGroup.controls;
	}
	// -------------------------------------------------------------------------------------------
	getSimilarAndRequir(e: any) {
		this.getEndorsTypeByPolicy(e.name, this.uiState.requestDetailsFromClient.policyNo!);
		this.getCSRequirments(
			e.name,
			this.uiState.requestDetailsFromClient.insurComp!,
			this.uiState.requestDetailsFromClient.className!,
			this.uiState.requestDetailsFromClient.lineOfBusiness!
		);
	}

	getEndorsTypeByPolicy(endorsType: string, policyNo: string) {
		let sub = this.customerService.getEndorsTypeByPolicy(endorsType, policyNo).subscribe(
			(res: HttpResponse<IBaseResponse<EndorsTypeByPolicy[]>>) => {
				this.uiState.endorsTypes = res.body?.data!;
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
			}
		);
		this.subscribes.push(sub);
	}

	getCSRequirments(endorsType: string, insuranceCompName: string, classofInsurance: string, lineOfBusiness: string) {
		this.f.requiermentsList.clear();
		let sub = this.customerService.getCSRequirments(endorsType, insuranceCompName, classofInsurance, lineOfBusiness).subscribe(
			(res: HttpResponse<IBaseResponse<string[]>>) => {
				let data = [] as RequiermentsList[];
				res.body?.data!.map((item: string) => {
					data.push({
						itemCheck: new FormControl(false),
						itemValue: new FormControl(item),
					});
				});
				data.map((c: any) => this.createReqFormArr(c));
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
			}
		);
		this.subscribes.push(sub);
	}

	get requirmentsControlArray() {
		return this.formGroup.get("requiermentsList") as FormArray;
	}

	requirmentsControls(i: number, control: string): AbstractControl {
		return this.requirmentsControlArray.controls[i].get(control)!;
	}

	createReqFormArr(c: RequiermentsList) {
		let formCon = new FormGroup<RequiermentsList>({
			itemCheck: c.itemCheck,
			itemValue: c.itemValue,
		});
		this.f.requiermentsList?.push(formCon);
		this.requirmentsControlArray.updateValueAndValidity();
	}

	checkAllRequirments(e: any) {
		if (e.target.checked) {
			this.requirmentsControlArray?.controls?.forEach((c) => {
				c?.get("itemCheck")?.patchValue(true);
			});
		} else {
			this.requirmentsControlArray?.controls?.forEach((c) => {
				c?.get("itemCheck")?.patchValue(false);
			});
		}
	}

	requirmentsChecker() {
		let checkAll = this.requirmentsControlArray.controls.every((c) => c.get("itemCheck")?.value === true);
		if (checkAll) this.checkAllRequierments.nativeElement.checked = true;
		else this.checkAllRequierments.nativeElement.checked = false;
	}
	// --------------------------------------------------------------------------------------------------------------------

	vatHandler(): void {
		this.f.vatValue?.patchValue((+this.f.netPremium?.value! + +this.f.policyFees?.value!) * (this.f.vatPerc?.value! / 100));
		this.f.totalPremium?.patchValue(+this.f.netPremium?.value! + +this.f.policyFees?.value! + +this.f.vatValue?.value!);
	}

	validationChecker(): boolean {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
		if (this.formGroup.invalid) return false;
		return true;
	}

	submitForm(form: FormGroup<ICSForm>) {
		this.submitted = true;
		let isRequierment = form.value.requiermentsList!.some((e) => {
			return e.itemCheck === true;
		});
		if (!this.validationChecker()) return;
		this.eventService.broadcast(reserved.isLoading, true);
		const val = form.getRawValue();
		const formData = new FormData();
		if (this.uiState.editMode) formData.append("sNo", val.sNo!.toString());
		formData.append("ClientID", val.clientID ? val.clientID.toString() : "");
		formData.append("ClientName", val.clientName ? val.clientName : "");
		formData.append("PolicyNo", val.policyNo ? val.policyNo : "");

		formData.append(
			"PolicySerial",
			this.uiState.requestDetailsFromClient.policiesSNo ? this.uiState.requestDetailsFromClient.policiesSNo.toString() : ""
		);
		formData.append("ClientPolicySNo", this.uiState.requestDetailsFromClient.sNo ? this.uiState.requestDetailsFromClient.sNo.toString() : "");
		formData.append("EndorsType", val.endorsType ? val.endorsType : "");

		formData.append("InsurComp", val.insurComp ? val.insurComp : "");
		formData.append("ClassOfBusiness", val.classOfBusiness ? val.classOfBusiness : "");
		formData.append("LineOfBusiness", val.lineOfBusiness ? val.lineOfBusiness : "");
		formData.append("ExistingPolExpDate", val.existingPolExpDate ? this.util.dateFormater(val.existingPolExpDate) : "");
		formData.append("RequestDetails", val.requestDetails ? val.requestDetails : "");
		formData.append("DateOfDeadline", val.dateOfDeadline ? this.util.dateFormater(val.dateOfDeadline!) : "");

		formData.append("NetPremium", val.netPremium ? val.netPremium?.toString()! : "");
		formData.append("VatPerc", val.vatPerc ? val.vatPerc?.toString()! : "");
		formData.append("VatValue", val.vatValue ? val.vatValue?.toString()! : "");
		formData.append("PolicyFees", val.policyFees ? val.policyFees?.toString()! : "");
		formData.append("TotalPremium", val.totalPremium ? val.totalPremium?.toString()! : "");
		formData.append("Branch", val.branch ? val.branch! : "");
		val.requiermentsList!.forEach((e, i) => {
			formData.append(`RequiermentsList[${i}].checked`, String(e.itemCheck!));
			formData.append(`RequiermentsList[${i}].item`, e.itemValue!);
		});

		this.documentsToUpload.forEach((el) => {
			console.log("Documents", el);
			formData.append("DocumentsModel", el);
		});
		formData.append("isRequierment", isRequierment ? "true" : "false");
		formData.append("notifyClient", "0");
		formData.append("notifyInsurer", "0");
		formData.append("sNo", "0");
		formData.append("pending", "false");
		formData.append("docSNo", "0");

		let sub = this.customerService.saveRequest(formData).subscribe(
			(res: HttpResponse<IBaseResponse<any>>) => {
				if (res.body?.status) {
					this.message.toast(res.body.message!, "success");
					// if (this.uiState.editId) this.router.navigate([AppRoutes.Client.base]);
					this.resetForm();
				} else this.message.popup("Sorry!", res.body?.message!, "warning");
				// Hide Loader
				this.eventService.broadcast(reserved.isLoading, false);
			},
			(err) => this.message.popup("Sorry!", err.message!, "warning")
		);
		this.subscribes.push(sub);
	}

	resetForm(): void {
		this.formGroup.reset();
		let date = {
			gon: {
				year: this.uiState.date.getFullYear(),
				month: this.uiState.date.getMonth() + 1,
				day: this.uiState.date.getDate(),
			},
		};
		this.expiryDate(date);
		this.uiState.requestDetailsFromClient = {};
		this.uiState.endorsTypes = [];
		this.submitted = false;
	}

	documentsList(evt: File[]) {
		this.documentsToUpload = evt;
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
