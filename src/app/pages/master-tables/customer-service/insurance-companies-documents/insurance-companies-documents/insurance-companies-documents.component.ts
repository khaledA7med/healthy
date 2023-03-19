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
import { InsuranceCompaniesDocumentsService } from "src/app/shared/services/master-tables/customer-service/insurance-companies-documents.service";
import { InsuranceCompaniesDocumentsCols } from "src/app/shared/app/grid/InsuranceCompaniesDocumentsCols";
import {
	IInsuranceCompaniesDocuments,
	IInsuranceCompaniesDocumentsData,
} from "src/app/shared/app/models/MasterTables/customer-service/i-insurance-companies-documents";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import {
	IInsuranceCompaniesDocumentsForm,
	IInsuranceCompaniesDocumentsFormData,
} from "src/app/shared/app/models/MasterTables/customer-service/i-insurance-companies-form";
import { IDocumentReq } from "src/app/shared/app/models/App/IDocumentReq";

@Component({
	selector: "app-insurance-companies-documents",
	templateUrl: "./insurance-companies-documents.component.html",
	styleUrls: ["./insurance-companies-documents.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class InsuranceCompaniesDocumentsComponent implements OnInit, OnDestroy {
	lookupData!: Observable<IBaseMasterTable>;
	InsuranceCompaniesDocumentsFormSubmitted = false as boolean;
	InsuranceCompaniesDocumentsModal!: NgbModalRef;
	InsuranceCompaniesDocumentsForm!: FormGroup<IInsuranceCompaniesDocumentsForm>;
	documentsToUpload: File[] = [];
	docs: any[] = [];

	@ViewChild("InsuranceCompaniesDocumentsContent") InsuranceCompaniesDocumentsContent!: TemplateRef<any>;
	@ViewChild("dropzone") dropzone!: any;

	uiState = {
		gridReady: false,
		submitted: false,
		list: [] as IInsuranceCompaniesDocuments[],
		totalPages: 0,
		editInsuranceCompaniesDocumentsMode: false as Boolean,
		editInsuranceCompaniesDocumentsData: {} as IInsuranceCompaniesDocumentsData,
		company: "Wataniya Insurance Company",
		type: "Motor",
		documentdetails: {} as IInsuranceCompaniesDocumentsData,
	};

	subscribes: Subscription[] = [];

	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: InsuranceCompaniesDocumentsCols,
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
			const data: IInsuranceCompaniesDocumentsFormData = {
				company: this.uiState.company,
				type: this.uiState.type,
			};
			let sub = this.InsuranceCompaniesDocumentsService.getInsuranceCompaniesDocuments(data).subscribe(
				(res: HttpResponse<IBaseResponse<IInsuranceCompaniesDocuments[]>>) => {
					if (res.body?.status) {
						this.uiState.list = res.body?.data!;
						params.successCallback(this.uiState.list, this.uiState.list.length);
					} else this.message.popup("Oops!", res.body?.message!, "error");

					this.uiState.gridReady = true;
					this.gridApi.hideOverlay();
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
		// this.gridApi.sizeColumnsToFit();
	}
	constructor(
		private InsuranceCompaniesDocumentsService: InsuranceCompaniesDocumentsService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService,
		private modalService: NgbModal
	) {}

	ngOnInit(): void {
		this.initInsuranceCompaniesDocumentsForm();
		this.getLookupData();
	}

	getLookupData() {
		this.lookupData = this.table.getBaseData(MODULES.InsuranceCompaniesDocuments);
	}

	documentsList(evt: File[]) {
		this.documentsToUpload = evt;
	}

	deleteFile(index: number, path: string) {
		let data: IDocumentReq = {
			module: "Master Tables",
			path: "",
			sno: 0,
		};
		this.message.confirm(` Delete it !`, ` Delete it !`, "danger", "warning").then((result: any) => {
			if (result.isConfirmed) {
				let sub = this.InsuranceCompaniesDocumentsService.deleteDocument(data).subscribe({
					next: (res) => {
						if (res.body?.status === true) {
							this.message.toast(res.body?.message!, "success");
							// this.uiState.documentdetails?.splice(index, 1);
						} else this.message.popup("Sorry", res.body?.message!, "warning");
					},
					error: (error) => {
						this.message.popup("Oops!", error.message, "error");
					},
				});
				this.subscribes.push(sub);
			}
		});
	}

	downloadFile(path: string) {
		let data: IDocumentReq = {
			module: "Production",
			path: "",
			sno: 0,
		};
		let sub = this.InsuranceCompaniesDocumentsService.downloadDocument(data).subscribe({
			next: (res) => {
				const downloadedFile = new Blob([res.body as BlobPart], {
					type: res.body,
				});
				const a = document.createElement("a");
				a.setAttribute("style", "display:none;");
				document.body.appendChild(a);
				a.download = path;
				a.href = URL.createObjectURL(downloadedFile);
				a.target = "_blank";
				a.click();
				document.body.removeChild(a);
			},
			error: (error) => {
				this.message.popup("Oops!", error.message, "error");
			},
		});
		this.subscribes.push(sub);
	}

	openInsuranceCompaniesDocumentsDialoge() {
		this.resetInsuranceCompaniesDocumentsForm();
		this.InsuranceCompaniesDocumentsModal = this.modalService.open(this.InsuranceCompaniesDocumentsContent, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
			backdrop: "static",
			size: "lg",
		});

		this.InsuranceCompaniesDocumentsModal.hidden.subscribe(() => {
			this.resetInsuranceCompaniesDocumentsForm();
			this.InsuranceCompaniesDocumentsFormSubmitted = false;
			this.uiState.editInsuranceCompaniesDocumentsMode = false;
		});
	}

	initInsuranceCompaniesDocumentsForm() {
		this.InsuranceCompaniesDocumentsForm = new FormGroup<IInsuranceCompaniesDocumentsForm>({
			company: new FormControl("", Validators.required),
			type: new FormControl(""),
		});
	}

	get f() {
		return this.InsuranceCompaniesDocumentsForm.controls;
	}

	validationChecker(): boolean {
		if (this.InsuranceCompaniesDocumentsForm.invalid) {
			this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
			return false;
		}
		return true;
	}

	changeInsurance(e: any) {
		this.uiState.company = e?.name;
	}
	filterByType(e: any) {
		this.uiState.type = e?.name;
		this.gridApi.setDatasource(this.dataSource);
	}

	submitInsuranceCompaniesDocumentsData(InsuranceCompaniesDocumentsForm: FormGroup<IInsuranceCompaniesDocumentsForm>) {
		this.InsuranceCompaniesDocumentsFormSubmitted = true;
		// Display Submitting Loader
		this.eventService.broadcast(reserved.isLoading, true);
		let val = InsuranceCompaniesDocumentsForm.getRawValue();
		const formData = new FormData();

		formData.append("company", val.company!);
		formData.append("type", val.type!);
		this.documentsToUpload.forEach((el) => formData.append("documents", el));

		let sub = this.InsuranceCompaniesDocumentsService.uploadInsuranceCompaniesDocuments(formData).subscribe(
			(res: HttpResponse<IBaseResponse<number>>) => {
				if (res.body?.status) {
					this.InsuranceCompaniesDocumentsModal?.dismiss();
					this.uiState.submitted = false;
					this.resetInsuranceCompaniesDocumentsForm();
					this.gridApi.setDatasource(this.dataSource);
					this.message.toast(res.body?.message!, "success");
				} else this.message.popup("Oops!", res.body?.message!, "error");

				this.eventService.broadcast(reserved.isLoading, false);
			}
		);
		this.subscribes.push(sub);
	}

	resetInsuranceCompaniesDocumentsForm() {
		this.InsuranceCompaniesDocumentsForm.reset();
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
