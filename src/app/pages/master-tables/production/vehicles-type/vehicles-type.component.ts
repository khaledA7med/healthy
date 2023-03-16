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
import { IVehicleTypeFilter, IVehicleTypeForm, IVehicleTypeReq } from "src/app/shared/app/models/MasterTables/production/i-vehicle-type";
import { VehicleTypeCols } from "src/app/shared/app/grid/MasterTableVehicleTypeCols";

@Component({
	selector: "app-vehicles-type",
	templateUrl: "./vehicles-type.component.html",
	styleUrls: ["./vehicles-type.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class VehiclesTypeComponent implements OnInit, OnDestroy {
	@ViewChild("formDialoge") formDialoge!: TemplateRef<any>;
	formGroup!: FormGroup<IVehicleTypeForm>;
	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		submitted: false as Boolean,
		gridReady: false as Boolean,
		lists: {
			itemsList: [] as IVehicleTypeFilter[],
			linesOfBusiness: [] as IGenericResponseType[],
		},
		editItemData: {} as IVehicleTypeReq,
		editMode: false as Boolean,
	};
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: VehicleTypeCols,
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
			if (this.f.make?.valid!) {
				let sub = this.productionService.getVehicleType(this.f.make?.value!).subscribe(
					(res: HttpResponse<IBaseResponse<IVehicleTypeFilter[]>>) => {
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
			} else {
				params.successCallback([], 0);
				if (this.uiState.lists.itemsList.length === 0) this.gridApi.showNoRowsOverlay();
			}
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
		this.formGroup = new FormGroup<IVehicleTypeForm>({
			sNo: new FormControl(0),
			make: new FormControl(null, Validators.required),
			type: new FormControl("", Validators.required),
		});
	}

	get f() {
		return this.formGroup.controls;
	}

	getEditItemData(id: string) {
		let sub = this.productionService.editVehicleType(id).subscribe(
			(res: IBaseResponse<IVehicleTypeReq>) => {
				if (res?.status) {
					this.uiState.editMode = true;
					this.uiState.editItemData = res.data!;
					this.formGroup.patchValue({
						sNo: this.uiState.editItemData.sNo!,
						make: this.uiState.editItemData.make!,
						type: this.uiState.editItemData.type!,
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
		let sub = this.productionService.deleteVehicleType(id).subscribe(
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

	onSubmit(formGroup: FormGroup<IVehicleTypeForm>) {
		this.uiState.submitted = true;
		if (this.formGroup?.invalid) {
			return;
		}
		console.log(formGroup.getRawValue());
		this.eventService.broadcast(reserved.isLoading, true);
		const data: IVehicleTypeReq = {
			...formGroup.getRawValue(),
		};
		let sub = this.productionService.saveVehicleType(data).subscribe(
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
		if (this.f.make?.valid) {
			this.uiState.submitted = false;
			this.modalRef = this.modalService.open(this.formDialoge, {
				ariaLabelledBy: "modal-basic-title",
				centered: true,
				backdrop: "static",
				size: "lg",
			});

			this.modalRef.hidden.subscribe(() => {
				this.f.sNo?.patchValue(0);
				this.f.type?.patchValue("");
				this.uiState.editMode = false;
			});
		} else {
			this.uiState.submitted = true;
		}
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}

	resetForm() {
		this.formGroup.reset();
		this.submitted = false;
	}
}
