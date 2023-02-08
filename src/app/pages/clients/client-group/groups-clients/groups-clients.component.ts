import { Component, ElementRef, OnInit, OnDestroy, ViewEncapsulation, TemplateRef, OnChanges, Input } from "@angular/core";
import { ClientsGroupsService } from "src/app/shared/services/clients/clients.groups.service";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { groupClientsCols } from "src/app/shared/app/grid/clinetGroupsCols";
import PerfectScrollbar from "perfect-scrollbar";
import { MessagesService } from "src/app/shared/services/messages.service";
import { Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { IClientGroups } from "src/app/shared/app/models/Clients/iclientgroups";
import { IClient } from "src/app/shared/app/models/Clients/iclient";

@Component({
	selector: "app-groups-clients",
	templateUrl: "./groups-clients.component.html",
	styleUrls: ["./groups-clients.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class GroupsClientsComponent implements OnInit, OnDestroy, OnChanges {
	@Input() group?: IClientGroups;
	@Input() groupsList?: IClientGroups[];
	clientsList: IClient[] = [];

	subscribes: Subscription[] = [];

	addClientModal!: NgbModalRef;

	addClientToGroupForm!: FormGroup;
	addClientToGroupFormSubmitted: boolean = false;

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
		columnDefs: groupClientsCols,
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

	ngOnChanges(): void {
		if (this.group == undefined) {
			return;
		} else {
			this.gridApi.setDatasource(this.dataSource);
		}
	}

	ngOnInit() {}

	constructor(
		private groupService: ClientsGroupsService,
		private message: MessagesService,
		private tableRef: ElementRef,
		private modalService: NgbModal
	) {
		this.addClientToGroupForm = new FormGroup({
			clientId: new FormControl(null, Validators.required),
			groupName: new FormControl(null, Validators.required),
		});
	}

	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			if (this.group) {
				this.gridApi.showLoadingOverlay();
				let sub = this.groupService.getGroupClients(this.group?.groupName!).subscribe(
					(res: HttpResponse<IBaseResponse<IClient[]>>) => {
						this.uiState.group.list = res.body?.data!;
						params.successCallback(this.uiState.group.list, this.uiState.group.list.length);
						this.uiState.gridReady = true;
						this.gridApi.hideOverlay();
					},
					(err: HttpErrorResponse) => {
						this.message.popup("Oops!", err.message, "error");
					}
				);
				this.subscribes.push(sub);
			}
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

	get form() {
		return this.addClientToGroupForm.controls;
	}

	openAddClientDialoge(content: TemplateRef<any>) {
		// this.addGroupForm.reset();
		let clientsSub = this.groupService.getAllClients().subscribe((res) => {
			if (res.body?.status) {
				// this.message.toast(res.body?.message!, "success");
				this.clientsList = res.body?.data!;
				this.addClientModal = this.modalService.open(content, {
					ariaLabelledBy: "modal-basic-title",
					centered: true,
					backdrop: "static",
				});
				let sub = this.addClientModal.hidden.subscribe(() => {
					this.addClientToGroupForm.reset();
					this.addClientToGroupFormSubmitted = false;
				});
				this.subscribes.push(sub);
			} else {
				this.message.toast(res.body?.message!, "error");
			}
		});

		this.subscribes.push(clientsSub);
	}

	submitAddClientToGroup() {
		this.addClientToGroupFormSubmitted = true;
		let data = {
			clientId: Number(this.addClientToGroupForm.value["clientId"]),
			groupName: this.addClientToGroupForm.value["groupName"],
		};
		if (!this.addClientToGroupForm.valid) {
			return;
		} else {
			let sub = this.groupService.addClient(data.clientId, data.groupName).subscribe((res) => {
				if (res.body?.status) {
					this.message.toast(res.body?.message!, "success");
				} else {
					this.message.toast(res.body?.message!, "error");
				}
				this.gridApi.setDatasource(this.dataSource);
			});
			this.addClientModal.close();
			this.subscribes.push(sub);
		}
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
