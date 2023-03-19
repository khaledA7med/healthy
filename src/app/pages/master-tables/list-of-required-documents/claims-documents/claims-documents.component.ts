import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { Caching, IBaseMasterTable, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { ListOfRequiredDocumentsService } from "src/app/shared/services/master-tables/list-of-required-documents/list-of-required-documents.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
import { MODULES } from "src/app/core/models/MODULES";
import {
	IClaimsDocumentFilter,
	IClaimsDocumentForm,
	IClaimsDocumentReq,
} from "src/app/shared/app/models/MasterTables/list-of-required-documents/i-claims-documents";
import { ClaimsListOfDocumentseCols } from "src/app/shared/app/grid/MasterTableListOfDocClaimsCols";

@Component({
	selector: "app-claims-documents",
	templateUrl: "./claims-documents.component.html",
	styleUrls: ["./claims-documents.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class ClaimsDocumentsComponent implements OnInit, OnDestroy {
	@ViewChild("formDialoge") formDialoge!: TemplateRef<any>;
	formGroup!: FormGroup<IClaimsDocumentForm>;
	lookupData!: Observable<IBaseMasterTable>;

	subscribes: Subscription[] = [];
	uiState = {
		submitted: false as Boolean,
		gridReady: false as Boolean,
		lists: {
			itemsList: [] as IClaimsDocumentFilter[],
			linesOfBusiness: [] as IGenericResponseType[],
		},
		editItemData: {} as IClaimsDocumentReq,
		editMode: false as Boolean,
	};
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: ClaimsListOfDocumentseCols,
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

			let sub = this.listOfDocumentsService
				.getClaimsDocuments({ insurClass: this.f.classOfInsurance?.value!, lineOfBusiness: this.f.lineofBusiness?.value! })
				.subscribe((res: HttpResponse<IBaseResponse<IClaimsDocumentFilter[]>>) => {
					if (res.body?.status) {
						this.uiState.lists.itemsList = res.body?.data!;
						params.successCallback(this.uiState.lists.itemsList, this.uiState.lists.itemsList.length);
						if (this.uiState.lists.itemsList.length === 0) this.gridApi.showNoRowsOverlay();
						else this.gridApi.hideOverlay();
					} else this.message.popup("Oops!", res.body?.message!, "error");

					this.uiState.gridReady = true;
					this.gridApi.hideOverlay();
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
		if ((this, this.uiState.lists.itemsList.length > 0)) this.gridApi.sizeColumnsToFit();
	}

	modalRef!: NgbModalRef;

	constructor(
		private modalService: NgbModal,
		private message: MessagesService,
		private listOfDocumentsService: ListOfRequiredDocumentsService,
		private eventService: EventService,
		private methods: MasterMethodsService,
		private table: MasterTableService
	) {}

	ngOnInit(): void {
		this.initForm();
		this.lookupData = this.table.getBaseData(MODULES.MasterTableListOfRequiredDocuments);
	}

	initForm() {
		this.formGroup = new FormGroup<IClaimsDocumentForm>({
			sNo: new FormControl(0),
			docName: new FormControl("", Validators.required),
			classOfInsurance: new FormControl("", Validators.required),
			lineofBusiness: new FormControl("", Validators.required),
		});
	}

	getLineOfBusiness(cls: string): void {
		let sub = this.methods.getLineOfBusiness(cls).subscribe((res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>) => {
			this.f.lineofBusiness?.reset();
			this.uiState.lists.linesOfBusiness = res.body?.data?.content!;
		});
		this.subscribes.push(sub);
	}

	get f() {
		return this.formGroup.controls;
	}

	getEditItemData(id: string) {
		let sub = this.listOfDocumentsService.editClaimsDocuments(id).subscribe((res: IBaseResponse<IClaimsDocumentReq>) => {
			if (res?.status) {
				this.uiState.editMode = true;
				this.uiState.editItemData = res.data!;
				this.formGroup.patchValue({
					sNo: this.uiState.editItemData.sNo!,
					docName: this.uiState.editItemData.docName!,
				});
				this.openformDialoge();
			} else this.message.toast(res.message!, "error");
		});
		this.subscribes.push(sub);
	}

	deleteItem(id: string) {
		let sub = this.listOfDocumentsService.deleteClaimsDocuments(id).subscribe((res: IBaseResponse<any>) => {
			if (res?.status) {
				this.gridApi.setDatasource(this.dataSource);
				this.message.toast(res.message!, "success");
			} else this.message.toast(res.message!, "error");
		});
		this.subscribes.push(sub);
	}

	onSubmit(formGroup: FormGroup<IClaimsDocumentForm>) {
		this.uiState.submitted = true;
		if (this.formGroup?.invalid) {
			return;
		}
		this.eventService.broadcast(reserved.isLoading, true);
		const data: IClaimsDocumentReq = {
			...formGroup.getRawValue(),
		};
		let sub = this.listOfDocumentsService.saveClaimsDocuments(data).subscribe(
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
		if (this.f.classOfInsurance?.valid && this.f.lineofBusiness?.valid) {
			this.uiState.submitted = false;
			this.modalRef = this.modalService.open(this.formDialoge, {
				ariaLabelledBy: "modal-basic-title",
				centered: true,
				backdrop: "static",
				size: "lg",
			});

			this.modalRef.hidden.subscribe(() => {
				this.resetForm();
			});
		} else {
			this.uiState.submitted = true;
		}
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}

	resetForm() {
		this.f.sNo?.patchValue(0);
		this.f.docName?.reset();
		this.uiState.editMode = false;
		this.uiState.submitted = false;
	}
}
