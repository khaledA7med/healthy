import { CustomerServiceService } from "./../../../shared/services/customer-service/customer-service.service";
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, StatusPanelDef } from "ag-grid-community";
import { Observable, Subscription } from "rxjs";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";

import PerfectScrollbar from "perfect-scrollbar";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { ICustomerServiceFilters } from "src/app/shared/app/models/CustomerService/icustomer-service-filter";
import { ICustomerService } from "src/app/shared/app/models/CustomerService/icustomer-service";
import { customerServiceManageCols } from "src/app/shared/app/grid/customerServiceCols";
import AppUtils from "src/app/shared/app/util";
import { ICustomerServiceFollowUp } from "src/app/shared/app/models/CustomerService/icustomer-service-followup";
import { CustomerServiceStatus, CustomerServiceStatusRes } from "src/app/shared/app/models/CustomerService/icustomer-service-utils";
import { RangePickerModule } from "src/app/shared/components/range-picker/range-picker.module";
import { IChangeCsStatusRequest } from "src/app/shared/app/models/CustomerService/icustomer-service-req";
RangePickerModule;

@Component({
	selector: "app-customer-service-list",
	templateUrl: "./customer-service-list.component.html",
	styleUrls: ["./customer-service-list.component.scss"],
	providers: [AppUtils],
	encapsulation: ViewEncapsulation.None,
})
export class CustomerServiceListComponent implements OnInit, AfterViewInit, OnDestroy {
	submitted = false;

	@ViewChild("filter") CsFilter!: ElementRef;
	@ViewChild("followUp") FollowUpCanvas!: ElementRef;
	@ViewChild("datePicker") datePicker!: ElementRef;

	context: any = { comp: this };

	uiState = {
		routerLink: { forms: AppRoutes.CustomerService.create },
		gridReady: false,
		submitted: false,
		filters: {
			pageNumber: 1,
			pageSize: 50,
			orderBy: "sNo",
			orderDir: "asc",
			status: ["New Request", "Pending"],
		} as ICustomerServiceFilters,
		customerService: {
			list: [] as ICustomerService[],
			totalPages: 0,
		},
		followUpData: {
			list: [] as ICustomerServiceFollowUp[],
			requestNo: "",
		},
		statusCount: {
			pendingCount: 0,
			newRequestCount: 0,
			closeCount: 0,
			canceledCount: 0,
		},
	};

	// Follow Up Canvas
	followUpForm!: FormGroup;
	// filter form
	filterForms!: FormGroup;
	lookupData!: Observable<IBaseMasterTable>;
	// to unSubscribe
	subscribes: Subscription[] = [];
	// Grid Definitions
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: customerServiceManageCols,
		suppressCsvExport: true,
		paginationPageSize: this.uiState.filters.pageSize,
		cacheBlockSize: this.uiState.filters.pageSize,
		context: { comp: this },
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			sortable: true,
			resizable: true,
		},
		onGridReady: (e) => this.onGridReady(e),
		onCellClicked: (e) => this.onCellClicked(e),
		onSortChanged: (e) => this.onSort(e),
		onPaginationChanged: (e) => this.onPageChange(e),
	};

	constructor(
		private customerService: CustomerServiceService,
		private tableRef: ElementRef,
		private message: MessagesService,
		private offcanvasService: NgbOffcanvas,
		private table: MasterTableService,
		private appUtils: AppUtils
	) {}

	ngAfterViewInit(): void {}

	ngOnInit(): void {
		this.initFollowUpForm();
		this.initFilterForm();
		this.getLookupData();
	}

	// Table Section
	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();

			let sub = this.customerService.getCustomerService(this.uiState.filters).subscribe(
				(res: HttpResponse<IBaseResponse<ICustomerService[]>>) => {
					this.uiState.customerService.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;

					this.uiState.customerService.list = res.body?.data!;
					this.drawStatusCount(res.body?.data!);

					params.successCallback(this.uiState.customerService.list, this.uiState.customerService.totalPages);
					this.uiState.gridReady = true;
					this.gridApi.hideOverlay();
				},
				(err: HttpErrorResponse) => {
					this.message.popup("Oops!", err.message, "error");
					this.gridApi.hideOverlay();
				}
			);
			this.subscribes.push(sub);
		},
	};

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

	//#region filter Section
	openFilterOffcanvas(): void {
		this.offcanvasService.open(this.CsFilter, { position: "end" });
	}

	private initFilterForm(): void {
		this.filterForms = new FormGroup({
			client: new FormControl(null),
			status: new FormControl([...this.uiState.filters.status!]),
			type: new FormControl([]),
			requestNo: new FormControl(null),
			branch: new FormControl(null),
			insuranceCompany: new FormControl(null),
			pendingReason: new FormControl(null),
			classOfBusniess: new FormControl(null),
			createdBy: new FormControl(null),
			deadline: new FormControl(null),
			deadlineFrom: new FormControl(null),
			deadlineTo: new FormControl(null),
			duration: new FormControl({ value: null, disabled: true }),
		});
	}

	CheckdurationEvt(e: Event) {
		let elem = e.target as HTMLInputElement;
		if (elem.checked) {
			this.f["duration"]?.enable();
		} else {
			this.f["duration"]?.reset();
			this.f["duration"]?.disable();
		}
		this.f["duration"]?.updateValueAndValidity();
	}

	get f() {
		return this.filterForms.controls;
	}

	setDeadLineFilter(e: any) {
		this.f["deadlineFrom"].patchValue(this.appUtils.dateFormater(e.from));
		this.f["deadlineTo"].patchValue(this.appUtils.dateFormater(e.to));
	}

	getLookupData() {
		this.lookupData = this.table.getBaseData(MODULES.CustomerService);
	}

	modifyFilterReq() {
		this.uiState.filters = {
			...this.uiState.filters,
			...this.filterForms.value,
			duration: this.f["duration"].value ? JSON.stringify(this.f["duration"].value) : "",
		};
	}

	onCSFilter(): void {
		this.modifyFilterReq();
		this.gridApi.setDatasource(this.dataSource);
	}

	clearFilter() {
		this.filterForms.reset();
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

	loadFollowUpData(requestNo: string): void {
		let sub = this.customerService.getFollowUps(requestNo).subscribe(
			(res: HttpResponse<IBaseResponse<ICustomerServiceFollowUp[]>>) => {
				if (res.body?.status) {
					this.uiState.followUpData.requestNo = requestNo;
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

	openCustomerServiceFollowUp(requestNo: string): void {
		let sub = this.offcanvasService.open(this.FollowUpCanvas, { position: "end" });
		sub.dismissed.subscribe(() => {
			this.followUpForm.reset();
			this.followUpForm.markAsUntouched();
			this.uiState.submitted = false;
		});
		this.uiState.submitted = false;
		this.loadFollowUpData(requestNo);
	}

	sendFollowUp() {
		this.ff["no"].patchValue(this.uiState.followUpData.requestNo);
		this.uiState.submitted = true;
		if (!this.followUpForm.valid) {
			return;
		} else {
			let sub = this.customerService.saveNote(this.followUpForm.value).subscribe(
				(res: HttpResponse<IBaseResponse<ICustomerServiceFollowUp[]>>) => {
					if (res.body?.status) {
						this.message.toast(res.body!.message!, "success");
						this.followUpForm.reset();
						this.loadFollowUpData(this.uiState.followUpData.requestNo);
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

	changeStatus(CS: ICustomerService, status: string, reason?: string): void {
		let dataSubmit: IChangeCsStatusRequest = {
			sno: CS.sno!,
			reqNo: CS.requestNo!,
			status,
			reason,
		};
		switch (status) {
			case CustomerServiceStatus.Pending:
				dataSubmit.status = CustomerServiceStatus.Pending;
				break;
			case CustomerServiceStatus.Close:
				dataSubmit.status = CustomerServiceStatus.Close;
				dataSubmit.reason = "";
				break;
			case CustomerServiceStatus.Cancel:
				dataSubmit.status = CustomerServiceStatus.Cancel;
				dataSubmit.reason = CS.rejectionReason;
				break;
			default:
				dataSubmit.status = status;
				break;
		}
		let sub = this.customerService.changeStatus(dataSubmit).subscribe(
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

	drawStatusCount(data: ICustomerService[]) {
		let pending: ICustomerService[] = data.filter((el) => {
				return el.status === CustomerServiceStatusRes.Pending;
			}),
			newReq: ICustomerService[] = data.filter((el) => {
				return el.status === CustomerServiceStatusRes.NewRequest;
			}),
			closed: ICustomerService[] = data.filter((el) => {
				return el.status === CustomerServiceStatusRes.Closed;
			}),
			cancelled: ICustomerService[] = data.filter((el) => {
				return el.status === CustomerServiceStatusRes.Cancelled;
			});

		let parent = document.getElementsByClassName("ag-paging-panel")[0];
		let child = document.createElement("div");
		child.setAttribute("id", "statusCount");
		let statusCountChecker = document.getElementById("statusCount");
		if (statusCountChecker) {
			parent.removeChild(statusCountChecker);
		}
		let childContent = `<div class=" col-12 d-flex align-items-center">
					<div class="badge bg-warning mx-1 p-1 text-dark">
					${CustomerServiceStatusRes.Pending} <span>(${pending.length})</span>
					</div>
					<div class="badge bg-yellow mx-1 p-1 text-dark">
					${CustomerServiceStatusRes.NewRequest} <span>(${newReq.length})</span>
					</div>
					<div class="badge bg-success mx-1 p-1 text-dark">
					${CustomerServiceStatusRes.Closed} <span>(${closed.length})</span>
					</div>
					<div class="badge bg-danger mx-1 p-1 text-dark">
					${CustomerServiceStatusRes.Cancelled} <span>(${cancelled.length})</span>
					</div>
					</div>`;
		child.classList.add("col", "my-2");
		child.innerHTML = "";
		child.innerHTML = childContent;
		parent.prepend(child);
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
