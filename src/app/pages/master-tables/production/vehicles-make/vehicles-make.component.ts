import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { IGenericResponseType } from "src/app/core/models/masterTableModels";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { MasterTableProductionService } from "src/app/shared/services/master-tables/production/production.service";
import { IVehicleMakeFilter, IVehicleMakeForm, IVehicleMakeReq } from "src/app/shared/app/models/MasterTables/production/i-vehicle-make";
import { VehicleMakeCols } from "src/app/shared/app/grid/MasterTableVehicleMakeCols";
@Component({
	selector: "app-vehicles-make",
	templateUrl: "./vehicles-make.component.html",
	styleUrls: ["./vehicles-make.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class VehiclesMakeComponent implements OnInit, OnDestroy {
	@ViewChild("formDialoge") formDialoge!: TemplateRef<any>;
	formGroup!: FormGroup<IVehicleMakeForm>;
	submitted: boolean = false;

	subscribes: Subscription[] = [];
	uiState = {
		submitted: false as Boolean,
		gridReady: false as Boolean,
		lists: {
			itemsList: [] as IVehicleMakeFilter[],
			linesOfBusiness: [] as IGenericResponseType[],
		},
		editItemData: {} as IVehicleMakeReq,
		editMode: false as Boolean,
	};
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: VehicleMakeCols,
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

			let sub = this.productionService.getVehicleMake().subscribe(
				(res: HttpResponse<IBaseResponse<IVehicleMakeFilter[]>>) => {
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
		private eventService: EventService
	) {}

	ngOnInit(): void {
		this.initForm();
	}

	initForm() {
		this.formGroup = new FormGroup<IVehicleMakeForm>({
			sNo: new FormControl(0),
			make: new FormControl("", Validators.required),
		});
	}

	get f() {
		return this.formGroup.controls;
	}

	getEditItemData(id: string) {
		let sub = this.productionService.editVehicleMake(id).subscribe(
			(res: IBaseResponse<IVehicleMakeReq>) => {
				if (res?.status) {
					this.uiState.editMode = true;
					this.uiState.editItemData = res.data!;
					this.formGroup.patchValue({
						sNo: this.uiState.editItemData.sNo!,
						make: this.uiState.editItemData.make!,
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
		let sub = this.productionService.deleteVehicleMake(id).subscribe(
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

	onSubmit(formGroup: FormGroup<IVehicleMakeForm>) {
		this.uiState.submitted = true;
		if (this.formGroup?.invalid) {
			return;
		}
		this.eventService.broadcast(reserved.isLoading, true);
		const data: IVehicleMakeReq = {
			...formGroup.getRawValue(),
		};
		let sub = this.productionService.saveVehicleMake(data).subscribe((res: IBaseResponse<any>) => {
			if (res.status) {
				this.modalRef.dismiss();
				this.eventService.broadcast(reserved.isLoading, false);
				this.message.toast(res.message!, "success");
				this.gridApi.setDatasource(this.dataSource);
			} else this.message.popup("Sorry!", res.message!, "warning");
			// Hide Loader
			this.eventService.broadcast(reserved.isLoading, false);
		});
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
			this.resetForm();
		});
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}

	resetForm() {
		this.formGroup.reset();
		this.f.sNo?.patchValue(0);
		this.uiState.editMode = false;
		this.uiState.submitted = false;
	}
}
