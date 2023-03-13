import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { MasterTableProductionService } from "src/app/shared/services/master-tables/production/production.service";
import { ILifePlanFilter } from "src/app/shared/app/models/MasterTables/production/i-life-plan-filter";
import { ILifePlanForm, ILifePlanReq } from "src/app/shared/app/models/MasterTables/production/i-life-plan-form";
import { masterTableLifePlanCols } from "src/app/shared/app/grid/MasterTableLifePlanCols";

@Component({
	selector: "app-life-plan",
	templateUrl: "./life-plan.component.html",
	styleUrls: ["./life-plan.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class LifePlanComponent implements OnInit, OnDestroy {
	@ViewChild("formDialoge") formDialoge!: TemplateRef<any>;
	formGroup!: FormGroup<ILifePlanForm>;
	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		submitted: false as Boolean,
		gridReady: false as Boolean,
		lists: {
			itemsList: [] as ILifePlanFilter[],
			linesOfBusiness: [] as IGenericResponseType[],
		},
		editItemData: {} as ILifePlanReq,
		editMode: false as Boolean,
	};
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: masterTableLifePlanCols,
		suppressCsvExport: true,
		context: { comp: this },
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			sortable: true,
			resizable: true,
		},
		overlayNoRowsTemplate: "<alert class='alert alert-secondary'>No Data To Show</alert>",
		onGridReady: (e) => this.onGridReady(e),
		onCellClicked: (e) => this.onCellClicked(e),
	};

	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();

			let sub = this.productionService.getLifePlans(this.f.insuranceCompany?.value!).subscribe(
				(res: HttpResponse<IBaseResponse<ILifePlanFilter[]>>) => {
					if (res.body?.status) {
						this.uiState.lists.itemsList = res.body?.data!;
						params.successCallback(this.uiState.lists.itemsList, this.uiState.lists.itemsList.length);
						if (this.uiState.lists.itemsList.length === 0) this.gridApi.showNoRowsOverlay();
						else this.gridApi.hideOverlay();
					} else {
						this.uiState.gridReady = true;
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
		if ((this, this.uiState.lists.itemsList.length > 0)) this.gridApi.sizeColumnsToFit();
	}

	modalRef!: NgbModalRef;

	constructor(
		private modalService: NgbModal,
		private message: MessagesService,
		private productionService: MasterTableProductionService,
		private table: MasterTableService,
		private eventService: EventService
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.MasterTableProductionLibraries);
	}

	initFilterForm() {
		this.formGroup = new FormGroup<ILifePlanForm>({
			sNo: new FormControl(0),
			insuranceCompany: new FormControl("", Validators.required),
			planName: new FormControl("", Validators.required),
		});
	}

	get f() {
		return this.formGroup.controls;
	}

	getEditItemData(id: string) {
		let sub = this.productionService.editLifePlan(id).subscribe(
			(res: IBaseResponse<ILifePlanReq>) => {
				if (res?.status) {
					this.uiState.editMode = true;
					this.uiState.editItemData = res.data!;
					this.formGroup.patchValue({
						sNo: this.uiState.editItemData.sNo!,
						planName: this.uiState.editItemData.planName!,
						insuranceCompany: this.uiState.editItemData.insuranceCompany!,
					});

					console.log(this.formGroup.getRawValue());
					this.openformDialoge();
				} else this.message.toast(res.message!, "error");
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
			}
		);
		this.subscribes.push(sub);
	}

	deleteItem(id: string) {
		let sub = this.productionService.deleteLifePlan(id).subscribe(
			(res: IBaseResponse<any>) => {
				if (res?.status) {
					this.gridApi.setDatasource(this.dataSource);
					this.message.toast(res.message!, "success");
				} else this.message.toast(res.message!, "error");
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
			}
		);
		this.subscribes.push(sub);
	}

	onSubmit(formGroup: FormGroup<ILifePlanForm>) {
		this.uiState.submitted = true;
		if (this.formGroup?.invalid) {
			return;
		}
		console.log(formGroup.getRawValue());
		this.eventService.broadcast(reserved.isLoading, true);
		const data: ILifePlanReq = {
			...formGroup.getRawValue(),
		};
		let sub = this.productionService.saveLifePlan(data).subscribe(
			(res: IBaseResponse<any>) => {
				if (res.status) {
					this.modalRef.dismiss();
					this.eventService.broadcast(reserved.isLoading, false);
					this.message.toast(res.message!, "success");
					this.gridApi.setDatasource(this.dataSource);
				} else this.message.popup("Sorry!", res.message!, "warning");
				// Hide Loader
				this.eventService.broadcast(reserved.isLoading, false);
			},
			(err) => {
				this.eventService.broadcast(reserved.isLoading, false);
				this.message.popup("Sorry!", err.message!, "error");
			}
		);
		this.subscribes.push(sub);
	}

	openformDialoge() {
		this.modalRef = this.modalService.open(this.formDialoge, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
			backdrop: "static",
			size: "lg",
		});

		this.modalRef.hidden.subscribe(() => {
			this.f.sNo?.patchValue(0);
			this.f.planName?.patchValue("");
			this.uiState.editMode = false;
		});
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}

	resetForm() {
		this.formGroup.reset();
		this.submitted = false;
	}
}
