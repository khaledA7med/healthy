import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
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
import { EndorsTypeByPolicy, RequiermentsList } from "src/app/shared/app/models/CustomerService/icustomer-service-utils";

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

	uiState = {
		editMode: false,
		editId: "",
		requestDetails: {} as CSPolicyData,
		policyList: {
			list: [] as CSPolicyData[],
			totalPages: 0,
		},
		endorsTypes: [] as EndorsTypeByPolicy[],
	};

	@ViewChild("dropzone") dropzone!: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
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

	fillCSFormData(e: CSPolicyData) {
		this.modalService.dismissAll();
		this.uiState.requestDetails = e;
		this.formGroup.patchValue({
			clientID: this.uiState.requestDetails.clientNo!,
			clientName: this.uiState.requestDetails.clientName!,
			producer: this.uiState.requestDetails.producer!,
			classOfBusiness: this.uiState.requestDetails.className!,
			policyNo: this.uiState.requestDetails.policyNo!,
			lineOfBusiness: this.uiState.requestDetails.lineOfBusiness!,
			insurComp: this.uiState.requestDetails.insurComp!,
			dateOfDeadline: this.util.dateStructFormat(new Date().toLocaleDateString()) as any,
			existingPolExpDate: this.util.dateStructFormat(this.uiState.requestDetails.periodTo!) as any,
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
		this.getEndorsTypeByPolicy(e.name, this.uiState.requestDetails.policyNo!);
		this.getCSRequirments(
			e.name,
			this.uiState.requestDetails.insurComp!,
			this.uiState.requestDetails.className!,
			this.uiState.requestDetails.lineOfBusiness!
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
		const formData = new FormData();
		formData.append("ClientID", form.value.clientID ? form.value.clientID.toString() : "");
		formData.append("ClientName", form.value.clientName ? form.value.clientName : "");
		formData.append("PolicyNo", form.value.policyNo ? form.value.policyNo : "");

		formData.append("PolicySerial", this.uiState.requestDetails.policiesSNo ? this.uiState.requestDetails.policiesSNo.toString() : "");
		formData.append("ClientPolicySNo", this.uiState.requestDetails.sNo ? this.uiState.requestDetails.sNo.toString() : "");
		formData.append("EndorsType", form.value.endorsType ? form.value.endorsType : "");

		formData.append("InsurComp", form.value.insurComp ? form.value.insurComp : "");
		formData.append("ClassOfBusiness", form.value.classOfBusiness ? form.value.classOfBusiness : "");
		formData.append("LineOfBusiness", form.value.lineOfBusiness ? form.value.lineOfBusiness : "");
		formData.append("ExistingPolExpDate", form.value.existingPolExpDate ? this.util.dateFormater(form.value.existingPolExpDate) : "");
		formData.append("RequestDetails", form.value.requestDetails ? form.value.requestDetails : "");
		formData.append("DateOfDeadline", form.value.dateOfDeadline ? this.util.dateFormater(form.value.dateOfDeadline!) : "");

		formData.append("NetPremium", form.value.netPremium ? form.value.netPremium?.toString()! : "");
		formData.append("VatPerc", form.value.vatPerc ? form.value.vatPerc?.toString()! : "");
		formData.append("VatValue", form.value.vatValue ? form.value.vatValue?.toString()! : "");
		formData.append("PolicyFees", form.value.policyFees ? form.value.policyFees?.toString()! : "");
		formData.append("TotalPremium", form.value.totalPremium ? form.value.totalPremium?.toString()! : "");
		formData.append("Branch", form.value.branch ? form.value.branch! : "");
		form.value.requiermentsList!.forEach((e, i) => {
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
		this.submitted = false;
		this.uiState.requestDetails = {};
		this.uiState.endorsTypes = [];
	}

	documentsList(evt: File[]) {
		this.documentsToUpload = evt;
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
