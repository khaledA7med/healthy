import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Observable, Subscription, using } from "rxjs";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import PerfectScrollbar from "perfect-scrollbar";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IBusinessDevelopment } from "src/app/shared/app/models/BusinessDevelopment/ibusiness-development";
import { IBusinessDevelopmentFilters } from "src/app/shared/app/models/BusinessDevelopment/ibusiness-development-filters";
import { businessDevelopmentCols } from "src/app/shared/app/grid/businessDevelopmentCols";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BusinessDevelopmentService } from "src/app/shared/services/business-development/business-development.service";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { SalesLeadStatus, SalesLeadType } from "src/app/shared/app/models/BusinessDevelopment/business-development-util";
import { DragulaService } from "ng2-dragula";
import AppUtils from "src/app/shared/app/util";
import { SweetAlertResult } from "sweetalert2";
import { ISalesLeadFollowUps } from "src/app/shared/app/models/BusinessDevelopment/ibusiness-development-followups";

@Component({
	selector: "app-business-development-management",
	templateUrl: "./business-development-management.component.html",
	styleUrls: ["./business-development-management.component.scss"],
	encapsulation: ViewEncapsulation.None,
	providers: [AppUtils],
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
	};

	cardLists = {
		pending: [] as IBusinessDevelopment[],
		waitingClient: [] as IBusinessDevelopment[],
		prospect: [] as IBusinessDevelopment[],
		confirmed: [] as IBusinessDevelopment[],
		quoting: [] as IBusinessDevelopment[],
		lost: [] as IBusinessDevelopment[],
	};

	// Follow Up Canvas
	followUpForm!: FormGroup;

	// filter form
	filterForm!: FormGroup;

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
	context: any = { comp: this };

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
		private tableRef: ElementRef,
		private message: MessagesService,
		private dragulaService: DragulaService,
		private offcanvasService: NgbOffcanvas,
		private table: MasterTableService,
		private appUtils: AppUtils,
		private router: Router
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
			let sub = this.businssDevelopmenService.getAllSalesLeads(this.uiState.filters).subscribe(
				(res: HttpResponse<IBaseResponse<IBusinessDevelopment[]>>) => {
					this.uiState.salesLead.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;

					this.uiState.salesLead.list = res.body?.data!;
					params.successCallback(this.uiState.salesLead.list, this.uiState.salesLead.totalPages);
					this.gridApi.hideOverlay();
					this.uiState.gridReady = true;
					this.cardsDataFiltering();
				},
				(err: HttpErrorResponse) => {
					this.message.popup("Oops!", err.message, "error");
				}
			);
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
			// this.gridApi.setRowCount(this.uiState.salesLead.totalPages);
			// this.gridApi.paginationGoToPage(this.uiState.filters.pageNumber);
		}
	}

	onGridReady(param: GridReadyEvent) {
		this.gridApi = param.api;
		this.gridApi.setDatasource(this.dataSource);
		this.gridApi.sizeColumnsToFit();
		const agBodyHorizontalViewport: HTMLElement = this.tableRef.nativeElement.querySelector("#gridScrollbar .ag-body-horizontal-scroll-viewport");
		const agBodyViewport: HTMLElement = this.tableRef.nativeElement.querySelector("#gridScrollbar .ag-body-viewport");

		if (agBodyViewport) {
			const vertical = new PerfectScrollbar(agBodyViewport);
			vertical.update();
		}
		if (agBodyHorizontalViewport) {
			const horizontal = new PerfectScrollbar(agBodyHorizontalViewport);
			horizontal.update();
		}
	}

	draggableHandler(): void {
		this.dragulaService.createGroup(this.uiState.dragulaInit, {
			revertOnSpill: true,
		});
		let sub = this.dragulaService.dropModel(this.uiState.dragulaInit).subscribe(({ item, target, source }) => {
			this.message.confirm("Yes, Sure!", "Are You Sure To Change Status?!", "primary", "question").then((result: SweetAlertResult) => {
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
		console.log("called");
		let dataSubmit = {
			LeadNo: lead.leadNo!,
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
		let sub = this.businssDevelopmenService.changeStatus(dataSubmit).subscribe(
			(res: HttpResponse<IBaseResponse<any>>) => {
				this.gridApi.setDatasource(this.dataSource);
				if (res.body?.status) this.message.toast(res.body!.message!, "success");
				else this.message.toast(res.body!.message!, "error");
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
			}
		);
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
		this.filterForm = new FormGroup({
			clientName: new FormControl(null),
			groupName: new FormControl(null),
			status: new FormControl([]),
			leadType: new FormControl(null),
			branch: new FormControl(null),
			classOfBusiness: new FormControl(null),
			producer: new FormControl(null),
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

	modifyFilterReq() {
		this.uiState.filters = {
			...this.uiState.filters,
			...this.filterForm.value,
		};
	}

	setDeadLineFilter(e: any) {
		this.f["deadlineFrom"].setValue(this.appUtils.dateFormater(e.from));
		this.f["deadlineTo"].setValue(this.appUtils.dateFormater(e.to));
	}

	setSavedOnFilter(e: any) {
		this.f["savedOnFrom"].setValue(this.appUtils.dateFormater(e.from));
		this.f["savedOnTo"].setValue(this.appUtils.dateFormater(e.to));
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
		this.followUpForm = new FormGroup({
			names: new FormControl([], Validators.required),
			msg: new FormControl(null, Validators.required),
			no: new FormControl(null),
		});
	}

	get ff() {
		return this.followUpForm.controls;
	}

	loadFollowUpData(leadNo: string): void {
		let sub = this.businssDevelopmenService.getFollowUps(leadNo).subscribe(
			(res: HttpResponse<IBaseResponse<ISalesLeadFollowUps[]>>) => {
				if (res.body?.status) {
					this.uiState.followUpData.leadNo = leadNo;
					this.uiState.followUpData.list = res.body?.data!;
				} else {
					this.message.popup("Oops!", res.body?.message!, "error");
				}
			},
			(err: HttpErrorResponse) => {
				this.message.popup("Oops!", err.message, "error");
			}
		);
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
		this.ff["no"].patchValue(this.uiState.followUpData.leadNo);
		console.log(this.followUpForm.value);
		this.uiState.submitted = true;
		if (!this.followUpForm.valid) {
			return;
		} else {
			let sub = this.businssDevelopmenService.saveNote(this.followUpForm.value).subscribe(
				(res: HttpResponse<IBaseResponse<ISalesLeadFollowUps[]>>) => {
					console.log(res);
					if (res.body?.status) {
						this.message.toast(res.body!.message!, "success");
						this.followUpForm.reset();
						this.loadFollowUpData(this.uiState.followUpData.leadNo);
					} else this.message.toast(res.body!.message!, "error");
				},
				(err: HttpErrorResponse) => {
					this.message.popup("Oops!", err.message, "error");
				}
			);
			this.subscribes.push(sub);
		}
	}
	//#endregion

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
