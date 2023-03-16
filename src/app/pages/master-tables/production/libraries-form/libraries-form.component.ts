import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { Caching, IBaseMasterTable, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ReportsViewerComponent } from "src/app/shared/components/reports-viewer/reports-viewer.component";
import { ILibrariesForm } from "src/app/shared/app/models/MasterTables/production/i-libraries-form";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { MasterTableProductionService } from "src/app/shared/services/master-tables/production/production.service";
import { masterTableProductionCols } from "src/app/shared/app/grid/masterTableProductionCols";
import { ILibrariesFilter } from "src/app/shared/app/models/MasterTables/production/i-libraries-filter";

@Component({
	selector: "app-libraries-form",
	templateUrl: "./libraries-form.component.html",
	styleUrls: ["./libraries-form.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class LibrariesFormComponent implements OnInit, OnDestroy {
	@Input() searchURI!: string;
	@Input() saveURI!: string;
	@Input() editURI!: string;
	@Input() deleteURI!: string;

	formGroup!: FormGroup<ILibrariesForm>;
	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		submitted: false as Boolean,
		gridReady: false as Boolean,
		lists: {
			itemsList: [] as ILibrariesFilter[],
			linesOfBusiness: [] as IGenericResponseType[],
		},
	};
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: masterTableProductionCols,
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
			const data: {
				insurClass: string;
				lineOfBusiness: string;
			} = {
				insurClass: this.f.class?.value!,
				lineOfBusiness: this.f.lineOfBusiness?.value!,
			};
			let sub = this.productionService.getAllItems(this.searchURI, data).subscribe(
				(res: HttpResponse<IBaseResponse<ILibrariesFilter[]>>) => {
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
		private methods: MasterMethodsService,
		private productionService: MasterTableProductionService,
		private table: MasterTableService,
		private eventService: EventService
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.MasterTableProductionLibraries);
	}

	initFilterForm() {
		this.formGroup = new FormGroup<ILibrariesForm>({
			sNo: new FormControl(null),
			type: new FormControl(null),
			defaultTick: new FormControl(null),
			class: new FormControl(null),
			lineOfBusiness: new FormControl(null),
			insuranceCopmany: new FormControl(null),
			item: new FormControl(null),
			itemArabic: new FormControl(null),
			description: new FormControl(null),
			descriptionArabic: new FormControl(null),
			identity: new FormControl(null),
		});
	}

	getLineOfBusiness(cls: string): void {
		let sub = this.methods.getLineOfBusiness(cls).subscribe((res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>) => {
			this.uiState.lists.linesOfBusiness = res.body?.data?.content!;
		});
		this.subscribes.push(sub);
	}

	get f() {
		return this.formGroup.controls;
	}

	onSubmit(filterForm: FormGroup<ILibrariesForm>) {
		this.submitted = true;
		if (this.formGroup?.invalid) {
			return;
		}

		this.eventService.broadcast(reserved.isLoading, true);

		// let sub = this.productionService.viewCSReport(data).subscribe(
		// 	(res: HttpResponse<IBaseResponse<any>>) => {
		// 		if (res.body?.status) {
		// 			this.eventService.broadcast(reserved.isLoading, false);
		// 			this.message.toast(res.body.message!, "success");
		// 			this.openReportsViewer(res.body.data);
		// 		} else this.message.popup("Sorry!", res.body?.message!, "warning");
		// 		// Hide Loader
		// 		this.eventService.broadcast(reserved.isLoading, false);
		// 	},
		// 	(err) => {
		// 		this.eventService.broadcast(reserved.isLoading, false);
		// 		this.message.popup("Sorry!", err.message!, "error");
		// 	}
		// );
		// this.subscribes.push(sub);
	}

	openReportsViewer(data?: string): void {
		this.modalRef = this.modalService.open(ReportsViewerComponent, { fullscreen: true, scrollable: true });
		this.modalRef.componentInstance.data = {
			reportName: "CRM Reports",
			url: data,
		};
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}

	resetForm() {
		this.formGroup.reset();
		this.submitted = false;
	}
}
