import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MessagesService } from "src/app/shared/services/messages.service";
import readXlsxFile from "read-excel-file";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { motorExcelListCols } from "src/app/shared/app/grid/motorExcelListCols";
import { Subscription } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IMotorData } from "src/app/shared/app/models/Production/i-motor-active-list";
import { IMedicalData } from "src/app/shared/app/models/Production/i-medical-active-list";

@Component({
	selector: "app-upload-excel-list",
	templateUrl: "./upload-excel-list.component.html",
	styleUrls: ["./upload-excel-list.component.scss"],
})
export class UploadExcelListComponent implements OnInit,OnDestroy {
	@Input() data!: {
		id: string;
		endorsType: string;
	};

	uiState = {
		sno: "" as string,
		loadedData: false as boolean,
		updatedState: false as boolean,
		gridReady: false,
		submitted: false,
		motorData: [] as IMotorData[],
		medicalData: [] as IMedicalData[],
		filters: {
			pageNumber: 1,
			pageSize: 50,
			orderBy: "sNo",
			orderDir: "asc",
		},
	};
	subscribes: Subscription[] = [];

	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: motorExcelListCols,
		suppressCsvExport: true,
		// paginationPageSize: this.uiState.filters.pageSize,
		// cacheBlockSize: this.uiState.filters.pageSize,
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
		onSortChanged: (e) => this.onSort(e),
		onPaginationChanged: (e) => this.onPageChange(e),
	};
	constructor(public modal: NgbActiveModal, private message: MessagesService) {}

	ngOnInit(): void {
		console.log(this.data);
	}

	uploadExeceFile(e: any) {
		const schema = {
			"Name": {
				prop: "name",
				type: String,
				required: true,
			},
			Age: {
				prop: "age",
				type: Number,
				required: true,
			},
		};

		readXlsxFile(e.target.files[0],  this.data.endorsType === 'Motor' ?{ schema }: {schema}).then(({ rows, errors }) => {
			if (errors.length == 0) {
				console.log(rows);
				if(this.data.endorsType === 'Motor') this.uiState.motorData = rows;
				else this.uiState.medicalData = rows
			} else {
				console.log(errors);
				this.message.popup(
					"Error",
					`Invalid File : ${errors[0].column} is ${errors[0].error === "required" ? "missing from" : errors[0].error + " in"} ${
						errors.length < 1 && errors[0].row ? "row " + errors[0].row : ""
					}`,
					"error"
				);
			}
		});
	}

	//#region Grid Functions
	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();
			if(this.data.endorsType === "Motor")
			params.successCallback(this.uiState.motorData, this.uiState.motorData.length);
			else
			params.successCallback(this.uiState.medicalData, this.uiState.medicalData.length);

			this.gridApi.hideOverlay();
			this.uiState.gridReady = true;
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
		if (this.uiState.motorData.length > 0 || this.uiState.medicalData.length > 0) this.gridApi.sizeColumnsToFit();
	}
	//#endregion

	submitData() {}


	ngOnDestroy() {
		this.subscribes.forEach((s) => s.unsubscribe());
	}
}
