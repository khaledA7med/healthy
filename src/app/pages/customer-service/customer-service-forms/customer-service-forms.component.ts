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
import { GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, RowClickedEvent } from "ag-grid-community";
import { CSPoicySearchCols } from "src/app/shared/app/grid/csPolicySearchCols";
import { CSPolicySearchRequest } from "src/app/shared/app/models/CustomerService/icustomer-service-policy-search-req";
import { CSPolicyData } from "src/app/shared/app/models/CustomerService/icustomer-service-policy";

@Component({
	selector: "app-customer-service-forms",
	templateUrl: "./customer-service-forms.component.html",
	styleUrls: ["./customer-service-forms.component.scss"],
	providers: [AppUtils],
})
export class CustomerServiceFormsComponent implements OnInit {
	submitted = false;
	formData!: Observable<IBaseMasterTable>;
	formGroup!: FormGroup<ICSForm>;
	documentsToUpload: File[] = [];
	docs: any[] = [];
	subscribes: Subscription[] = [];

	uiState = {
		editMode: false,
		editId: "",
		requestDetails: {} as CSPolicyData,
		policyList: {
			list: [] as CSPolicyData[],
			totalPages: 0,
		},
	};

	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		paginationAutoPageSize: true,
		cacheBlockSize: 500,
		animateRows: true,
		columnDefs: CSPoicySearchCols,
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			sortable: false,
		},
		overlayNoRowsTemplate: "<alert class='alert alert-secondary'>No Data To Show</alert>",
		onGridReady: (e) => this.onGridReady(e),
		onRowClicked: (e) => this.onRowClicked(e),
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
			fullscreen: true,
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

	submitSearchPolicy() {
		this.gridApi.setDatasource(this.dataSource);
	}

	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();
			let dataTOSubmit: CSPolicySearchRequest = {
				clientNo: this.ff["clientNo"].value !== null ? this.ff["clientNo"].value : 0,
				policyNo: this.ff["policyNo"].value !== null ? this.ff["policyNo"].value : "",
				insuranceCompName: this.ff["insuranceCompName"].value !== null ? this.ff["insuranceCompName"].value : "",
			};
			let sub = this.customerService.searchPolicy(dataTOSubmit).subscribe(
				(res: HttpResponse<IBaseResponse<CSPolicyData[]>>) => {
					if (res.status) {
						this.uiState.policyList.totalPages = res.body?.data!.length!;
						this.uiState.policyList.list = res.body?.data!;
						params.successCallback(this.uiState.policyList.list, this.uiState.policyList.totalPages);
						if (this.uiState.policyList.list.length === 0) this.gridApi.showNoRowsOverlay();
						else this.gridApi.hideOverlay();
					} else {
						this.message.popup("Oops!", res.body?.message!, "warning");
						this.gridApi.hideOverlay();
					}
				},
				(err: HttpErrorResponse) => {
					this.message.popup("Oops!", err.message, "error");
				}
			);
			this.subscribes.push(sub);
		},
	};

	onRowClicked(e: RowClickedEvent) {
		this.uiState.requestDetails = e.data;
		this.modalService.dismissAll();
		this.fillCSFormData();
	}

	onGridReady(param: GridReadyEvent) {
		this.gridApi = param.api;
		this.gridApi.sizeColumnsToFit();
		this.gridApi.showNoRowsOverlay();
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

	fillCSFormData() {
		this.formGroup.patchValue({
			clientID: this.uiState.requestDetails.clientNo!,
			clientName: this.uiState.requestDetails.className!,
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
		});
	}

	get f() {
		return this.formGroup.controls;
	}

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
			(res: HttpResponse<IBaseResponse<any>>) => {
				console.log(res);
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
			}
		);
		this.subscribes.push(sub);
	}

	getCSRequirments(endorsType: string, insuranceCompName: string, classofInsurance: string, lineOfBusiness: string) {
		let sub = this.customerService.getCSRequirments(endorsType, insuranceCompName, classofInsurance, lineOfBusiness).subscribe(
			(res: HttpResponse<IBaseResponse<any>>) => {
				console.log(res);
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
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

	submitForm(form: FormGroup<ICSForm>) {
		this.submitted = true;
		if (!this.validationChecker()) return;
		const formData = new FormData();
		formData.append("PolicySerial", this.uiState.requestDetails.policiesSNo ? this.uiState.requestDetails.policiesSNo.toString() : "");
		formData.append("ClientPolicySNo", this.uiState.requestDetails.sNo ? this.uiState.requestDetails.sNo.toString() : "");
	}

	documentsList(evt: File[]) {
		this.documentsToUpload = evt;
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
