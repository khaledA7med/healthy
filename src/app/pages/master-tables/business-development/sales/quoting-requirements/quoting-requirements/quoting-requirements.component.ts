import { HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
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
import { MODULES } from "src/app/core/models/MODULES";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
import {
	IQuotingRequirements,
	IQuotingRequirementsData,
} from "src/app/shared/app/models/MasterTables/business-development/sales/i-quoting-requirements";
import { quotingRequirementsCols } from "src/app/shared/app/grid/quotingRequirementsCols";
import { QuotingRequirementsService } from "src/app/shared/services/master-tables/business-development/sales/quoting-requirements.service";

@Component({
	selector: "app-quoting-requirements",
	templateUrl: "./quoting-requirements.component.html",
	styleUrls: ["./quoting-requirements.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class QuotingRequirementsComponent implements OnInit, OnDestroy {
	lookupData!: Observable<IBaseMasterTable>;
	QuotingRequirementsFormSubmitted = false as boolean;
	QuotingRequirementsModal!: NgbModalRef;
	QuotingRequirementsForm!: FormGroup<IQuotingRequirements>;
	lineOfBussArr: IGenericResponseType[] = [];

	@ViewChild("QuotingRequirementsContent") QuotingRequirementsContent!: TemplateRef<any>;

	uiState = {
		gridReady: false,
		submitted: false,
		list: [] as IQuotingRequirements[],
		totalPages: 0,
		editQuotingRequirementsMode: false as Boolean,
		editQuotingRequirementsData: {} as IQuotingRequirementsData,
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
		columnDefs: quotingRequirementsCols,
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
			const data: IQuotingRequirementsData = {
				class: this.uiState.class,
				lineOfBusiness: this.uiState.lineOfBusiness,
				insuranceCopmany: this.uiState.insuranceCompanies,
			};
			let sub = this.QuotingRequirementsService.getQuotingRequirements(data).subscribe((res: HttpResponse<IBaseResponse<IQuotingRequirements[]>>) => {
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
			});
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
		private QuotingRequirementsService: QuotingRequirementsService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private modalService: NgbModal
	) {}

	ngOnInit(): void {
		this.initQuotingRequirementsForm();
		this.getLookupData();
	}

	getLookupData() {
		this.lookupData = this.table.getBaseData(MODULES.QuotingRequirements);
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

	DeleteQuotingRequirements(id: string) {
		let sub = this.QuotingRequirementsService.DeleteQuotingRequirements(id).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
			this.gridApi.setDatasource(this.dataSource);
			if (res.body?.status) this.message.toast(res.body!.message!, "success");
			else this.message.toast(res.body!.message!, "error");
		});
		this.subscribes.push(sub);
	}

	checkValue(event: any) {
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

	getQuotingRequirementsData(id: string) {
		this.eventService.broadcast(reserved.isLoading, true);
		let sub = this.QuotingRequirementsService.getEditQuotingRequirements(id).subscribe(
			(res: HttpResponse<IBaseResponse<IQuotingRequirementsData>>) => {
				if (res.body?.status) {
					this.uiState.editQuotingRequirementsMode = true;
					this.uiState.editQuotingRequirementsData = res.body?.data!;
					this.fillEditQuotingRequirementsForm(res.body?.data!);
				} else this.message.popup("Oops!", res.body?.message!, "error");

				this.eventService.broadcast(reserved.isLoading, false);
			}
		);
		this.subscribes.push(sub);
	}

	openQuotingRequirementsDialoge(id: string) {
		this.resetQuotingRequirementsForm();
		this.QuotingRequirementsModal = this.modalService.open(this.QuotingRequirementsContent, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
			backdrop: "static",
			size: "md",
		});

		this.getQuotingRequirementsData(id);

		this.QuotingRequirementsModal.hidden.subscribe(() => {
			this.resetQuotingRequirementsForm();
			this.QuotingRequirementsFormSubmitted = false;
			this.uiState.editQuotingRequirementsMode = false;
		});
	}

	initQuotingRequirementsForm() {
		this.QuotingRequirementsForm = new FormGroup<IQuotingRequirements>({
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
		return this.QuotingRequirementsForm.controls;
	}

	fillAddQuotingRequirementsForm(data: IQuotingRequirementsData) {
		this.f.item?.patchValue(data.item!);
		this.f.itemArabic?.patchValue(data.itemArabic!);
		this.f.description?.patchValue(data.description!);
		this.f.descriptionArabic?.patchValue(data.descriptionArabic!);
		this.f.defaultTick?.patchValue(data.defaultTick!);
		this.f.class?.patchValue(data.class!);
		this.f.lineOfBusiness?.patchValue(data.lineOfBusiness!);
		this.f.insuranceCopmany?.patchValue(data.insuranceCopmany!);
	}

	fillEditQuotingRequirementsForm(data: IQuotingRequirementsData) {
		this.f.item?.patchValue(data.item!);
		this.f.itemArabic?.patchValue(data.itemArabic!);
		this.f.description?.patchValue(data.description!);
		this.f.descriptionArabic?.patchValue(data.descriptionArabic!);
		this.f.defaultTick?.patchValue(data.defaultTick!);
	}

	validationChecker(): boolean {
		if (this.QuotingRequirementsForm.invalid) {
			this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
			return false;
		}
		return true;
	}

	submitQuotingRequirementsData(form: FormGroup) {
		this.uiState.submitted = true;
		const formData = form.getRawValue();
		const data: IQuotingRequirementsData = {
			sNo: this.uiState.editQuotingRequirementsMode ? this.uiState.editQuotingRequirementsData.sNo : 0,
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
		let sub = this.QuotingRequirementsService.saveQuotingRequirements(data).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
			if (res.body?.status) {
				this.QuotingRequirementsModal?.dismiss();
				this.uiState.submitted = false;
				this.resetQuotingRequirementsForm();
				this.gridApi.setDatasource(this.dataSource);
				this.message.toast(res.body?.message!, "success");
			} else this.message.popup("Oops!", res.body?.message!, "error");

			this.eventService.broadcast(reserved.isLoading, false);
		});
		this.subscribes.push(sub);
	}

	resetQuotingRequirementsForm() {
		this.QuotingRequirementsForm.reset();
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
