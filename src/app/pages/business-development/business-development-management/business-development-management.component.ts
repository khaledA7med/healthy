import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IBusinessDevelopment } from "src/app/shared/app/models/BusinessDevelopment/ibusiness-development";
import {
	IBusinessDevelopmentFilters,
	IBusinessDevelopmentFiltersForm,
} from "src/app/shared/app/models/BusinessDevelopment/ibusiness-development-filters";
import { businessDevelopmentCols } from "src/app/shared/app/grid/businessDevelopmentCols";
import { IBaseMasterTable, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BusinessDevelopmentService } from "src/app/shared/services/business-development/business-development.service";
import { HttpResponse } from "@angular/common/http";
import { ISalesLeadFollowUpsForm, SalesLeadStatus, SalesLeadType } from "src/app/shared/app/models/BusinessDevelopment/business-development-util";
import { DragulaService } from "ng2-dragula";
import AppUtils from "src/app/shared/app/util";
import { SweetAlertResult } from "sweetalert2";
import { ISalesLeadFollowUps } from "src/app/shared/app/models/BusinessDevelopment/ibusiness-development-followups";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";

@Component({
	selector: "app-business-development-management",
	templateUrl: "./business-development-management.component.html",
	styleUrls: ["./business-development-management.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class BusinessDevelopmentManagementComponent implements OnInit, OnDestroy {
	uiState = {
		view: "card",
		dragulaInit: "SALESLEADS",
		routerLink: {
			forms: AppRoutes.BusinessDevelopment.create,
		},
		gridReady: false,
		submitted: false,
		filters: {
			pageNumber: 1,
			pageSize: 50,
			orderBy: "sNo",
			orderDir: "asc",
		} as IBusinessDevelopmentFilters,
		salesLead: {
			list: [] as IBusinessDevelopment[],
			totalPages: 0,
		},
		followUpData: {
			list: [] as ISalesLeadFollowUps[],
			leadNo: "",
		},
		lineOfBusinessList: [] as IGenericResponseType[],
	};
	isLoading: boolean = false;
	cardLists = {
		pending: [] as IBusinessDevelopment[],
		waitingClient: [] as IBusinessDevelopment[],
		prospect: [] as IBusinessDevelopment[],
		confirmed: [] as IBusinessDevelopment[],
		quoting: [] as IBusinessDevelopment[],
		lost: [] as IBusinessDevelopment[],
	};

	// Follow Up Canvas
	followUpForm!: FormGroup<ISalesLeadFollowUpsForm>;

	// filter form
	filterForm!: FormGroup<IBusinessDevelopmentFiltersForm>;

	lookupData!: Observable<IBaseMasterTable>;
	leadType: any = [
		{
			id: 0,
			name: SalesLeadType.New,
		},
		{
			id: 1,
			name: SalesLeadType.Renewel,
		},
	];
	@ViewChild("filter") salesLeadFilter!: ElementRef;
	@ViewChild("followUp") FollowUpCanvas!: ElementRef;

	// To Unsubscription
	subscribes: Subscription[] = [];
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: businessDevelopmentCols,
		suppressCsvExport: true,
		paginationPageSize: this.uiState.filters.pageSize,
		cacheBlockSize: this.uiState.filters.pageSize,
		context: { comp: this },
		rowSelection: "single",
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			sortable: true,
		},
		onGridReady: (e) => this.onGridReady(e),
		onCellClicked: (e) => this.onCellClicked(e),
		onSortChanged: (e) => this.onSort(e),
		onPaginationChanged: (e) => this.onPageChange(e),
	};
	constructor(
		private businssDevelopmenService: BusinessDevelopmentService,
		private message: MessagesService,
		private dragulaService: DragulaService,
		private offcanvasService: NgbOffcanvas,
		private table: MasterTableService,
		private appUtils: AppUtils,
		private eventService: EventService
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.initFollowUpForm();
		this.getLookupData();
		this.draggableHandler();
	}

	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();
			if (this.uiState.view === "card") this.eventService.broadcast(reserved.isLoading, true);
			let sub = this.businssDevelopmenService
				.getAllSalesLeads(this.uiState.filters)
				.subscribe((res: HttpResponse<IBaseResponse<IBusinessDevelopment[]>>) => {
					if (res.body?.status) {
						this.uiState.salesLead.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;

						this.uiState.salesLead.list = res.body?.data!;
						params.successCallback(this.uiState.salesLead.list, this.uiState.salesLead.totalPages);
						this.gridApi.hideOverlay();
						this.uiState.gridReady = true;
						this.cardsDataFiltering();
						if (this.uiState.view === "card") this.eventService.broadcast(reserved.isLoading, false);
					} else {
						this.message.popup("Oops!", res.body?.message!, "error");
						if (this.uiState.view === "card") this.eventService.broadcast(reserved.isLoading, false);
					}
				});
			this.subscribes.push(sub);
		},
	};

	cardsDataFiltering() {
		this.cardLists = {
			confirmed: [],
			lost: [],
			prospect: [],
			pending: [],
			quoting: [],
			waitingClient: [],
		};
		this.uiState.salesLead.list.map((el) => {
			switch (el.status) {
				case SalesLeadStatus.Prospect:
					this.cardLists.prospect.push(el);
					break;
				case SalesLeadStatus.Confirmed:
					this.cardLists.confirmed.push(el);
					break;
				case SalesLeadStatus.Quoting:
					this.cardLists.quoting.push(el);
					break;
				case SalesLeadStatus.Lost:
					this.cardLists.lost.push(el);
					break;
				case SalesLeadStatus.PendingwithUnderwriting:
					this.cardLists.pending.push(el);
					break;
				case SalesLeadStatus.WaitingForClientFeedback:
					this.cardLists.waitingClient.push(el);
					break;
				default:
					break;
			}
		});
	}

	onSort(e: GridReadyEvent) {
		let colState = e.columnApi.getColumnState();
		colState.forEach((el) => {
			if (el.sort) {
				this.uiState.filters.orderBy = el.colId!;
				this.uiState.filters.orderDir = el.sort!;
			}
		});
	}

	onCellClicked(params: CellEvent) {
		if (params.column.getColId() == "action") {
			params.api.getCellRendererInstances({
				rowNodes: [params.node],
				columns: [params.column],
			});
		}
	}

	onPageSizeChange() {
		this.gridApi.paginationSetPageSize(+this.uiState.filters.pageSize);
		this.gridOpts.cacheBlockSize = +this.uiState.filters.pageSize;
		this.gridApi.showLoadingOverlay();
		this.gridApi.setDatasource(this.dataSource);
	}

	onPageChange(params: GridReadyEvent) {
		if (this.uiState.gridReady) {
			this.uiState.filters.pageNumber = this.gridApi.paginationGetCurrentPage() + 1;
		}
	}

	onGridReady(param: GridReadyEvent) {
		this.gridApi = param.api;
		this.gridApi.setDatasource(this.dataSource);
		if ((this, this.uiState.salesLead.list.length > 0)) this.gridApi.sizeColumnsToFit();
	}

	draggableHandler(): void {
		this.dragulaService.createGroup(this.uiState.dragulaInit, {
			revertOnSpill: true,
		});
		let sub = this.dragulaService.dropModel(this.uiState.dragulaInit).subscribe(({ item, target, source }) => {
			this.message.confirm("Sure!", "Change Status?!", "primary", "question").then((result: SweetAlertResult) => {
				if (result.isConfirmed) {
					this.changeStatus(item, target.id);
				} else {
					for (let [key, val] of Object.entries(this.cardLists)) {
						if (key === target.id) {
							type ObjectKey = keyof typeof this.cardLists;
							const propFrom = key as ObjectKey;
							const propTo = source.id as ObjectKey;
							this.cardLists[propFrom] = val.filter((e) => e.sNo !== item.sNo);
							this.cardLists[propTo].push(item);
							this.cardLists[propTo].sort((a, b) => a.sNo! - b.sNo!);
						}
					}
				}
			});
		});
		this.subscribes.push(sub);
	}

	changeStatus(lead: IBusinessDevelopment, status: string): void {
		if (this.uiState.view === "card") this.eventService.broadcast(reserved.isLoading, true);
		let dataSubmit = {
			leadNo: lead.leadNo!,
			status: "",
		};
		switch (status) {
			case "pending":
				dataSubmit.status = SalesLeadStatus.PendingwithUnderwriting;
				break;
			case "waitingClient":
				dataSubmit.status = SalesLeadStatus.WaitingForClientFeedback;
				break;
			case "prospect":
				dataSubmit.status = SalesLeadStatus.Prospect;
				break;
			case "confirmed":
				dataSubmit.status = SalesLeadStatus.Confirmed;
				break;
			case "quoting":
				dataSubmit.status = SalesLeadStatus.Quoting;
				break;
			case "lost":
				dataSubmit.status = SalesLeadStatus.Lost;
				break;
			default:
				dataSubmit.status = status;
				break;
		}
		let sub = this.businssDevelopmenService.changeStatus(dataSubmit).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
			if (res.body?.status) {
				this.gridApi.setDatasource(this.dataSource);
				if (res.body?.status) this.message.toast(res.body!.message!, "success");
				else this.message.toast(res.body!.message!, "error");

				if (this.uiState.view === "card") this.eventService.broadcast(reserved.isLoading, false);
			} else {
				this.message.popup("Oops!", res.body?.message!, "error");
				if (this.uiState.view === "card") this.eventService.broadcast(reserved.isLoading, false);
			}
		});
		this.subscribes.push(sub);
	}

	cardsPageChange(e: any) {
		this.uiState.filters.pageNumber = e;
		this.gridApi.paginationGoToPage(this.uiState.filters.pageNumber - 1);

		// this.getCardData();
	}

	//#region Filter Functions
	openSalesLeadFilters(): void {
		this.offcanvasService.open(this.salesLeadFilter, { position: "end" });
	}

	private initFilterForm(): void {
		this.filterForm = new FormGroup<IBusinessDevelopmentFiltersForm>({
			clientName: new FormControl(null),
			groupName: new FormControl(null),
			status: new FormControl([]),
			leadType: new FormControl(null),
			branch: new FormControl(null),
			classOfBusiness: new FormControl([]),
			lineOfBusiness: new FormControl([]),
			producer: new FormControl([]),
			user: new FormControl(null),
			deadlineFrom: new FormControl(null),
			deadlineTo: new FormControl(null),
			savedOnFrom: new FormControl(null),
			savedOnTo: new FormControl(null),
			expireIn: new FormControl(null),
		});
	}

	get f() {
		return this.filterForm.controls;
	}

	getLookupData() {
		this.lookupData = this.table.getBaseData(MODULES.BusinessDevelopment);
	}

	getLineOfBusiness(e: any) {
		let cls = e.map((el: any) => (el?.name ? el?.name : el));
		let sub = this.businssDevelopmenService.getLinesOFBusinessByClassNames(cls).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
			this.uiState.lineOfBusinessList = res.body?.data!;
		});
		this.subscribes.push(sub);
	}

	modifyFilterReq() {
		this.uiState.filters = {
			...this.uiState.filters,
			...this.filterForm.value,
			deadlineFrom: this.appUtils.dateFormater(this.f.deadlineFrom?.value!) as any,
			deadlineTo: this.appUtils.dateFormater(this.f.deadlineTo?.value!) as any,
			savedOnFrom: this.appUtils.dateFormater(this.f.savedOnFrom?.value!) as any,
			savedOnTo: this.appUtils.dateFormater(this.f.savedOnTo?.value!) as any,
		};
	}

	setDeadLineFilter(e: any) {
		this.f.deadlineFrom?.patchValue(e.from);
		this.f.deadlineTo?.patchValue(e.to);
	}

	setSavedOnFilter(e: any) {
		this.f.savedOnFrom?.patchValue(e.from);
		this.f.savedOnTo?.patchValue(e.to);
	}

	onSalesLeadFilters(): void {
		this.modifyFilterReq();
		this.gridApi.setDatasource(this.dataSource);
	}

	clearFilter() {
		this.filterForm.reset();
	}

	//#endregion

	//#region FollowUp Cancvas
	private initFollowUpForm(): void {
		this.followUpForm = new FormGroup<ISalesLeadFollowUpsForm>({
			names: new FormControl([], Validators.required),
			msg: new FormControl(null, Validators.required),
			no: new FormControl(null),
		});
	}

	get ff() {
		return this.followUpForm.controls;
	}

	loadFollowUpData(leadNo: string): void {
		let sub = this.businssDevelopmenService.getFollowUps(leadNo).subscribe((res: HttpResponse<IBaseResponse<ISalesLeadFollowUps[]>>) => {
			if (res.body?.status) {
				this.uiState.followUpData.leadNo = leadNo;
				this.uiState.followUpData.list = res.body?.data!;
			} else {
				this.message.popup("Oops!", res.body?.message!, "error");
			}
		});
		this.subscribes.push(sub);
	}

	openSalesLeadFollowUp(leadNo: string): void {
		let sub = this.offcanvasService.open(this.FollowUpCanvas, { position: "end" });
		sub.dismissed.subscribe(() => {
			this.followUpForm.reset();
			this.followUpForm.markAsUntouched();
			this.uiState.submitted = false;
		});
		this.uiState.submitted = false;
		this.loadFollowUpData(leadNo);
	}

	sendFollowUp() {
		this.ff.no?.patchValue(this.uiState.followUpData.leadNo);
		this.uiState.submitted = true;
		if (!this.followUpForm.valid) {
			return;
		} else {
			this.isLoading = true;
			let sub = this.businssDevelopmenService
				.saveNote(this.followUpForm.value)
				.subscribe((res: HttpResponse<IBaseResponse<ISalesLeadFollowUps[]>>) => {
					if (res.body?.status) {
						this.message.toast(res.body!.message!, "success");
						this.followUpForm.reset();
						this.loadFollowUpData(this.uiState.followUpData.leadNo);
						this.isLoading = false;
					} else this.message.toast(res.body!.message!, "error");
					this.isLoading = false;
				});
			this.subscribes.push(sub);
		}
	}
	//#endregion

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
		this.dragulaService.destroy(this.uiState.dragulaInit);
	}
}
