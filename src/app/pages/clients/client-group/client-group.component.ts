import { Component, ElementRef, OnInit, OnDestroy, ViewEncapsulation, TemplateRef } from "@angular/core";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { clientGroupsCols } from "src/app/shared/app/grid/clientGroupsCols";
import { Subscription } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IClientGroups } from "src/app/shared/app/models/Clients/iclientgroups";
import { ClientsGroupsService } from "src/app/shared/services/clients/clients.groups.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
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
		submitted: false as boolean,
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
	subscribes: Subscription[] = [];

	// Forms
	addGroupForm!: FormGroup;
	addGroupModal!: NgbModalRef;

	selectedGroup?: IClientGroups;

	// Forms Submittion Checkers
	addClientToGroupFormSubmitted: boolean = false;
	constructor(
		public groupService: ClientsGroupsService,
		private tableRef: ElementRef,
		public message: MessagesService,
		private modalService: NgbModal
	) {
		this.addGroupForm = new FormGroup({
			groupName: new FormControl(null, Validators.required),
		});
	}
	ngOnInit(): void {}

	//#region
	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			this.gridApi.showLoadingOverlay();

			let sub = this.groupService.getAllGroups().subscribe((res: HttpResponse<IBaseResponse<IClientGroups[]>>) => {
				if (res.body?.status) {
					this.uiState.group.list = res.body?.data!;
					params.successCallback(this.uiState.group.list, this.uiState.group.list.length);
					this.selectedGroup = this.uiState.group.list[0];
					this.uiState.gridReady = true;
				} else this.message.popup("Oops!", res.body?.message!, "error");
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
		} else if (params.column.getColId() == "groupName") {
			this.selectedGroup = params.data;
		}
	}

	onGridReady(param: GridReadyEvent) {
		this.gridApi = param.api;
		this.gridApi.setDatasource(this.dataSource);
		this.gridApi.sizeColumnsToFit();
	}
	//#endregion

	//#region Add Group Modal
	get form() {
		return this.addGroupForm.controls;
	}
	openAddGroupDialoge(content: TemplateRef<any>) {
		this.addGroupForm.reset();
		this.addGroupModal = this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", centered: true, backdrop: "static" });

		this.addGroupModal.hidden.subscribe(() => {
			this.addGroupForm.reset();
			this.uiState.submitted = false;
		});
	}

	submitCreateClientGroup() {
		this.uiState.submitted = true;
		if (!this.addGroupForm.valid) {
			return;
		} else {
			let gName = this.addGroupForm.value["groupName"];
			this.groupService.createGroup(gName).subscribe((res) => {
				if (res.body?.status) {
					this.message.toast(res.body?.message!, "success");
				} else {
					this.message.toast(res.body?.message!, "error");
				}
				this.gridApi.setDatasource(this.dataSource);
			});
			this.addGroupModal.close();
		}
	}

	//#endregion

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
