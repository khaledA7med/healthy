import { HttpResponse } from "@angular/common/http";
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { Caching, IBaseMasterTable, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
import { MODULES } from "src/app/core/models/MODULES";
import { policyIssuanceRequirementsCols } from "src/app/shared/app/grid/policyIssuanceRequirementsCols";
import {
	IPolicyIssuanceRequirements,
	IPolicyIssuanceRequirementsData,
} from "src/app/shared/app/models/MasterTables/business-development/sales/i-policy-issuance-requirements";
import { PolicyIssuanceRequirementsService } from "src/app/shared/services/master-tables/business-development/sales/policy-issuance-requirements.service";

@Component({
	selector: "app-policy-issuance-requirements",
	templateUrl: "./policy-issuance-requirements.component.html",
	styleUrls: ["./policy-issuance-requirements.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class PolicyIssuanceRequirementsComponent implements OnInit, OnDestroy {
	lookupData!: Observable<IBaseMasterTable>;
	PolicyIssuanceRequirementsFormSubmitted = false as boolean;
	PolicyIssuanceRequirementsModal!: NgbModalRef;
	PolicyIssuanceRequirementsForm!: FormGroup<IPolicyIssuanceRequirements>;
	lineOfBussArr: IGenericResponseType[] = [];

	@ViewChild("PolicyIssuanceRequirementsContent")
	PolicyIssuanceRequirementsContent!: TemplateRef<any>;

	uiState = {
		gridReady: false,
		submitted: false,
		list: [] as IPolicyIssuanceRequirements[],
		totalPages: 0,
		editPolicyIssuanceRequirementsMode: false as Boolean,
		editPolicyIssuanceRequirementsData: {} as IPolicyIssuanceRequirementsData,
		class: "Accident",
		lineOfBusiness: "Group Personal Accident",
		insuranceCompanies: "--All--",
		defaultTick: 0,
	};

	isChecked!: number;
	subscribes: Subscription[] = [];

	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: policyIssuanceRequirementsCols,
		suppressCsvExport: true,
		context: { comp: this },
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			sortable: true,
			resizable: true,
		},
		onGridReady: (e) => this.onGridReady(e),
		onCellClicked: (e) => this.onCellClicked(e),
	};

	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();
			const data: IPolicyIssuanceRequirementsData = {
				class: this.uiState.class,
				lineOfBusiness: this.uiState.lineOfBusiness,
				insuranceCopmany: this.uiState.insuranceCompanies,
			};
			let sub = this.PolicyIssuanceRequirementsService.getPolicyIssuanceRequirements(data).subscribe(
				(res: HttpResponse<IBaseResponse<IPolicyIssuanceRequirements[]>>) => {
					if (res.body?.status) {
						this.uiState.list = res.body?.data!;
						params.successCallback(this.uiState.list, this.uiState.list.length);
						if (this.uiState.list.length === 0) this.gridApi.showNoRowsOverlay();
						else this.gridApi.hideOverlay();
					} else {
						this.message.popup("Oops!", res.body?.message!, "error");
						this.uiState.gridReady = true;
						this.gridApi.hideOverlay();
					}
				}
			);
			this.subscribes.push(sub);
		},
	};

	onCellClicked(params: CellEvent) {
		if (params.column.getColId() == "action") {
			params.api.getCellRendererInstances({
				rowNodes: [params.node],
				columns: [params.column],
			});
		}
	}

	onPageSizeChange() {
		this.gridApi.showLoadingOverlay();
		this.gridApi.setDatasource(this.dataSource);
	}

	onGridReady(param: GridReadyEvent) {
		this.gridApi = param.api;
		this.gridApi.setDatasource(this.dataSource);
		// this.gridApi.sizeColumnsToFit();
	}

	constructor(
		private masterService: MasterMethodsService,
		private PolicyIssuanceRequirementsService: PolicyIssuanceRequirementsService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private modalService: NgbModal
	) {}

	ngOnInit(): void {
		this.initPolicyIssuanceRequirementsForm();
		this.getLookupData();
	}

	getLookupData() {
		this.lookupData = this.table.getBaseData(MODULES.PolicyIssuanceRequirements);
	}

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

	DeletePolicyIssuanceRequirements(id: string) {
		let sub = this.PolicyIssuanceRequirementsService.DeletePolicyIssuanceRequirements(id).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
			this.gridApi.setDatasource(this.dataSource);
			if (res.body?.status) this.message.toast(res.body!.message!, "success");
			else this.message.toast(res.body!.message!, "error");
		});
		this.subscribes.push(sub);
	}

	checkValue(event: any) {
		console.log(event);
		this.uiState.defaultTick = event;
	}

	changeClass(e: any) {
		this.uiState.class = e?.name;
	}
	changeLineOfBusiness(e: any) {
		this.uiState.lineOfBusiness = e?.name;
	}

	filter(e: any) {
		this.uiState.insuranceCompanies = e?.name;
		this.gridApi.setDatasource(this.dataSource);
	}

	getPolicyIssuanceRequirementsData(id: string) {
		this.eventService.broadcast(reserved.isLoading, true);
		let sub = this.PolicyIssuanceRequirementsService.getEditPolicyIssuanceRequirements(id).subscribe(
			(res: HttpResponse<IBaseResponse<IPolicyIssuanceRequirementsData>>) => {
				if (res.body?.status) {
					this.uiState.editPolicyIssuanceRequirementsMode = true;
					this.uiState.editPolicyIssuanceRequirementsData = res.body?.data!;
					this.fillEditPolicyIssuanceRequirementsForm(res.body?.data!);
				} else this.message.popup("Oops!", res.body?.message!, "error");
				this.eventService.broadcast(reserved.isLoading, false);
			}
		);
		this.subscribes.push(sub);
	}

	openPolicyIssuanceRequirementsDialoge(id: string) {
		this.resetPolicyIssuanceRequirementsForm();
		this.PolicyIssuanceRequirementsModal = this.modalService.open(this.PolicyIssuanceRequirementsContent, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
			backdrop: "static",
			size: "md",
		});

		this.getPolicyIssuanceRequirementsData(id);

		this.PolicyIssuanceRequirementsModal.hidden.subscribe(() => {
			this.resetPolicyIssuanceRequirementsForm();
			this.PolicyIssuanceRequirementsFormSubmitted = false;
			this.uiState.editPolicyIssuanceRequirementsMode = false;
		});
	}

	initPolicyIssuanceRequirementsForm() {
		this.PolicyIssuanceRequirementsForm = new FormGroup<IPolicyIssuanceRequirements>({
			sNo: new FormControl(null),
			item: new FormControl("", Validators.required),
			itemArabic: new FormControl("", Validators.required),
			description: new FormControl(""),
			descriptionArabic: new FormControl(""),
			defaultTick: new FormControl(null),
			class: new FormControl("", Validators.required),
			lineOfBusiness: new FormControl("", Validators.required),
			insuranceCopmany: new FormControl("", Validators.required),
		});
	}

	get f() {
		return this.PolicyIssuanceRequirementsForm.controls;
	}

	fillAddPolicyIssuanceRequirementsForm(data: IPolicyIssuanceRequirementsData) {
		this.f.item?.patchValue(data.item!);
		this.f.itemArabic?.patchValue(data.itemArabic!);
		this.f.description?.patchValue(data.description!);
		this.f.descriptionArabic?.patchValue(data.descriptionArabic!);
		this.f.defaultTick?.patchValue(data.defaultTick!);
		this.f.class?.patchValue(data.class!);
		this.f.lineOfBusiness?.patchValue(data.lineOfBusiness!);
		this.f.insuranceCopmany?.patchValue(data.insuranceCopmany!);
	}

	fillEditPolicyIssuanceRequirementsForm(data: IPolicyIssuanceRequirementsData) {
		this.f.item?.patchValue(data.item!);
		this.f.itemArabic?.patchValue(data.itemArabic!);
		this.f.description?.patchValue(data.description!);
		this.f.descriptionArabic?.patchValue(data.descriptionArabic!);
		this.f.defaultTick?.patchValue(data.defaultTick!);
	}

	validationChecker(): boolean {
		if (this.PolicyIssuanceRequirementsForm.invalid) {
			this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
			return false;
		}
		return true;
	}

	submitPolicyIssuanceRequirementsData(form: FormGroup) {
		this.uiState.submitted = true;
		const formData = form.getRawValue();
		const data: IPolicyIssuanceRequirementsData = {
			sNo: this.uiState.editPolicyIssuanceRequirementsMode ? this.uiState.editPolicyIssuanceRequirementsData.sNo : 0,
			class: formData.class,
			item: formData.item,
			itemArabic: formData.itemArabic,
			description: formData.description,
			descriptionArabic: formData.descriptionArabic,
			defaultTick: this.uiState.defaultTick,
			lineOfBusiness: formData.lineOfBusiness,
			insuranceCopmany: formData.insuranceCompanies,
		};
		if (!this.validationChecker()) return;
		this.eventService.broadcast(reserved.isLoading, true);
		let sub = this.PolicyIssuanceRequirementsService.savePolicyIssuanceRequirements(data).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
			if (res.body?.status) {
				this.PolicyIssuanceRequirementsModal?.dismiss();
				this.uiState.submitted = false;
				this.resetPolicyIssuanceRequirementsForm();
				this.gridApi.setDatasource(this.dataSource);
				this.message.toast(res.body?.message!, "success");
			} else this.message.popup("Oops!", res.body?.message!, "error");

			this.eventService.broadcast(reserved.isLoading, false);
		});
		this.subscribes.push(sub);
	}

	resetPolicyIssuanceRequirementsForm() {
		this.PolicyIssuanceRequirementsForm.reset();
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
