import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, RowClickedEvent } from "ag-grid-community";

import { MODULES } from "src/app/core/models/MODULES";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import AppUtils from "src/app/shared/app/util";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ReportsViewerComponent } from "src/app/shared/components/reports-viewer/reports-viewer.component";
import { ProductionService } from "src/app/shared/services/production/production.service";
import { DebitCreditNotesCols } from "src/app/shared/app/grid/debitCreditNotesCols";
import { debitCreditNoteForm, IdebitCreditNoteFilter } from "src/app/shared/app/models/Production/iproduction-notes-filters";
import { IDebitCreditNote } from "src/app/shared/app/models/Production/iproduction-notes";
import { DCNotesModel } from "src/app/shared/app/models/Production/production-util";
@Component({
	selector: "app-debit-credit-note-report",
	templateUrl: "./debit-credit-note-report.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./debit-credit-note-report.component.scss"],
})
export class DebitCreditNoteReportComponent implements OnInit, OnDestroy {
	url!: any;
	filterForm!: FormGroup<debitCreditNoteForm>;
	checkAllStatus: FormControl<boolean | null> = new FormControl(false);
	submitted: boolean = false;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		filters: {
			pageNumber: 1,
			pageSize: 50,
			orderBy: "sNo",
			orderDir: "asc",
		} as IdebitCreditNoteFilter,
		notes: {
			list: [] as IDebitCreditNote[],
			totalPages: 0,
		},
		selectedNote: null,
	};

	modalRef!: NgbModalRef;
	searchNotesModal!: NgbModalRef;
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		paginationAutoPageSize: true,
		cacheBlockSize: 500,
		animateRows: true,
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			resizable: true,
		},
		overlayNoRowsTemplate: "<alert class='alert alert-secondary'>No Data To Show</alert>",
		onGridReady: (e) => this.onGridReady(e),
		onRowClicked: (e) => this.onRowClicked(e),
	};
	constructor(
		private modalService: NgbModal,
		private productionService: ProductionService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private utils: AppUtils,
		private tableRef: ElementRef
	) {}

	ngOnInit(): void {
		this.initFilterForm();
		this.lookupData = this.table.getBaseData(MODULES.Reports);
	}

	onGridReady(param: GridReadyEvent) {
		this.gridApi = param.api;
		this.gridApi.setDatasource(this.dataSource);
		this.gridApi.sizeColumnsToFit();
		this.gridOpts.api!.setColumnDefs(DebitCreditNotesCols);
	}

	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();
			let sub = this.productionService.getAllArchiveNotes(this.uiState.filters).subscribe(
				(res: HttpResponse<IBaseResponse<IDebitCreditNote[]>>) => {
					if (res.status) {
						this.uiState.notes.list = res.body?.data!;
						params.successCallback(this.uiState.notes.list, this.uiState.notes.list.length);
						if (this.uiState.notes.list.length === 0) this.gridApi.showNoRowsOverlay();
						else this.gridApi.hideOverlay();
					} else {
						this.message.popup("Oops!", res.body?.message!, "warning");
						this.gridApi.hideOverlay();
					}
				},
				(err: HttpErrorResponse) => {
					this.gridApi.hideOverlay();
					this.message.popup("Oops!", err.message, "error");
				}
			);
			this.subscribes.push(sub);
		},
	};

	setDataSource() {
		this.gridApi.setDatasource(this.dataSource);
	}

	onRowClicked(e: RowClickedEvent) {
		this.uiState.selectedNote = e.data;
		this.eventService.broadcast(reserved.isLoading, true);
		let newData: DCNotesModel = {
			docSNo: e.data.docSNo,
			clientName: e.data.clientName,
			type: e.data.type,
			source: e.data.source,
			plain: e.data.plain,
			userFullName: e.data.userFullName,
			pram: e.data.pram,
			reportType: e.data.reportType,
		};
		let sub = this.productionService.viewDebitCreditNoteReport(newData).subscribe(
			(res: HttpResponse<IBaseResponse<string>>) => {
				if (res.ok) {
					this.openReportsViewer(res?.body?.data!);
				} else {
					this.message.popup("Oops!", res.body?.message!, "error");
				}
				this.eventService.broadcast(reserved.isLoading, false);
			},
			(err: HttpErrorResponse) => {
				this.eventService.broadcast(reserved.isLoading, false);
				this.message.popup("Oops!", err.message, "error");
			}
		);
		this.subscribes.push(sub);

		this.searchNotesModal.dismiss();
	}

	initFilterForm() {
		this.filterForm = new FormGroup<debitCreditNoteForm>({
			branchs: new FormControl(""),
			filter: new FormControl(""),
			plain: new FormControl(true),
			pram: new FormControl(1),
			reportType: new FormControl(1),
			minDate: new FormControl(null, Validators.required),
			maxDate: new FormControl(null, Validators.required),
		});
	}

	minDate(e: any) {
		this.f.minDate?.patchValue(e.gon);
	}

	maxDate(e: any) {
		this.f.maxDate?.patchValue(e.gon);
	}

	get f() {
		return this.filterForm.controls;
	}

	modifyFilterReq() {
		this.uiState.filters = {
			...this.uiState.filters,
			...this.filterForm.value,
			pram: +this.filterForm.value.pram!,
			reportType: +this.filterForm.value.reportType!,
			minDate: this.utils.dateFormater(this.filterForm.value.minDate) as any,
			maxDate: this.utils.dateFormater(this.filterForm.value.maxDate) as any,
		};
	}

	onSubmit(modal: any) {
		this.submitted = true;
		if (this.filterForm?.invalid) {
			return;
		}
		this.modifyFilterReq();
		this.searchNotesModal = this.modalService.open(modal, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
			backdrop: "static",
			size: "xl",
		});
	}

	openReportsViewer(data?: string): void {
		this.modalRef = this.modalService.open(ReportsViewerComponent, { fullscreen: true, scrollable: true });
		this.modalRef.componentInstance.data = {
			reportName: "Debite / Credit Notes (Clients Premium)",
			url: data,
		};
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}

	resetForm() {
		this.filterForm.reset();
		this.submitted = false;
	}
}
