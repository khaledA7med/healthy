import { Component, ElementRef, OnInit, OnDestroy, ViewEncapsulation, TemplateRef } from "@angular/core";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { clientGroupsCols } from "src/app/shared/app/grid/clinetGroupsCols";
import PerfectScrollbar from "perfect-scrollbar";
import { Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IClientGroups } from "src/app/shared/app/models/Clients/iclientgroups";
import { ClientsGroupsService } from "src/app/shared/services/clients/clients.groups.service";
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
@Component({
	selector: "app-client-group",
	templateUrl: "./client-group.component.html",
	styleUrls: ["./client-group.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class ClientGroupComponent implements OnInit, OnDestroy {
	uiState = {
		gridReady: false,
		filters: {
			// pageNumber: undefined,
			// pageSize: undefined,
			orderBy: "groupName",
			orderDir: "asc",
		},
		group: {
			list: [] as IClientGroups[],
		},
	};

	// Grid Definitions
	gridApi: GridApi = <GridApi>{};
	gridOpts: GridOptions = {
		pagination: false,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: clientGroupsCols,
		suppressCsvExport: true,
		context: { comp: this },
		// paginationPageSize: this.uiState.groupsList.length,
		// cacheBlockSize: this.uiState.groupsList.length,
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			sortable: true,
		},
		onGridReady: (e) => this.onGridReady(e),
		onCellClicked: (e) => this.onCellClicked(e),
	};
	subsribes: Subscription[] = [];

	constructor(
		public groupService: ClientsGroupsService,
		private tableRef: ElementRef,
		public message: MessagesService,
		private modalService: NgbModal
	) {}
	ngOnInit(): void {}

	//#region
	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();

			let sub = this.groupService.getAllClientsGroups().subscribe(
				(res: HttpResponse<IBaseResponse<IClientGroups[]>>) => {
					this.uiState.group.list = res.body?.data!;
					params.successCallback(this.uiState.group.list, this.uiState.group.list.length);
					this.uiState.gridReady = true;
					this.gridApi.hideOverlay();
				},
				(err: HttpErrorResponse) => {
					this.message.popup("Oops!", err.message, "error");
				}
			);
			this.subsribes.push(sub);
		},
	};

	onCellClicked(params: CellEvent) {
		if (params.column.getColId() == "action") {
			params.api.getCellRendererInstances({
				rowNodes: [params.node],
				columns: [params.column],
			});
		} else {
			console.log(params);
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
	//#endregion
	test!: NgbModalRef;
	//#region Add Group Modal
	openAddDialoge(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", centered: true }).result.then(
			(result) => {
				console.log(result);
				// this.test = result;
			},
			(reason) => {
				console.log(reason);
			}
		);
	}

	createClientGroup() {
		// this.modalService.
		// this.test.dismiss();
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return "by pressing ESC";
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return "by clicking on a backdrop";
		} else {
			return `with: ${reason}`;
		}
	}
	//#endregion

	ngOnDestroy(): void {
		this.subsribes && this.subsribes.forEach((s) => s.unsubscribe());
	}
}
