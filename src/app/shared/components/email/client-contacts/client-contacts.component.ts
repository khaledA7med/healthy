import { HttpResponse } from "@angular/common/http";
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { Subscription } from "rxjs";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { emailClientContactsCols } from "src/app/shared/app/grid/emailClientContactCols";
import { emailClientsCols } from "src/app/shared/app/grid/emailClientsCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IEmailClient, IEmailClientContact } from "src/app/shared/app/models/Email/email-utils";
import { EmailService } from "src/app/shared/services/emails/email.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { EmailModalComponent } from "../email-modal/email-modal.component";

@Component({
	selector: "app-client-contacts",
	templateUrl: "./client-contacts.component.html",
	styleUrls: ["./client-contacts.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class ClientContactsComponent implements OnInit, OnDestroy, OnChanges {
	clientInfo: FormControl = new FormControl();
	clientIDFilter: FormControl = new FormControl();
	clientNameFilter: FormControl = new FormControl();
	clientContactFormGroup!: FormGroup<any>;

	// ------------------------------------------------------------------------------------------------------------
	@Input() emailModalInstance!: EmailModalComponent;
	// ------------------------------------------------------------------------------------------------------------

	uiState = {
		filters: {
			sNo: 0,
			fullName: "",
			orderBy: "sno",
			orderDir: "asc",
		},
		Contactsilters: {
			orderBy: "sno",
			orderDir: "asc",
		} as IEmailClientContact,
		gridReady: false,
		submitted: false,
		showClientSearch: false,
		showSelectContact: false,
		showAddContact: false,
		selectedClientSno: 0,
		clients: {
			list: [] as IEmailClient[],
		},
		contacts: {
			list: [] as IEmailClientContact[],
		},
	};

	subscribes: Subscription[] = [];

	gridApi: GridApi = <GridApi>{};
	contactsGridApi: GridApi = <GridApi>{};

	gridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: emailClientsCols,
		suppressCsvExport: true,
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			sortable: true,
			resizable: true,
		},
		onGridReady: (e) => this.onGridReady(e),
		onCellClicked: (e) => this.onCellClicked(e),
		onSortChanged: (e) => this.onSort(e),
	};

	contactsGridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: emailClientContactsCols,
		context: { comp: this.emailModalInstance },
		suppressCsvExport: true,
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			sortable: true,
			resizable: true,
		},
		onGridReady: (e) => this.onGridReadyContacts(e),
		onCellClicked: (e) => this.onCellClickedContacts(e),
		onSortChanged: (e) => this.onSortContacts(e),
	};

	ngOnChanges(changes: SimpleChanges): void {
		console.log("Form ngOnChanges", this.emailModalInstance);
	}

	constructor(private eventService: EventService, private emailService: EmailService, private message: MessagesService) {}

	ngOnInit(): void {
		console.log("Form ngOnInit", this.emailModalInstance);
		this.contactsGridOpts.context = { comp: this.emailModalInstance };
		this.clientInfo.disable();
	}
	//#region Clients / Prospects Grid
	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			if (this.uiState.clients.list.length == 0) this.eventService.broadcast(reserved.isLoading, true);
			else this.gridApi.showLoadingOverlay();
			this.uiState.filters.sNo = this.clientIDFilter.value || 0;
			this.uiState.filters.fullName = this.clientNameFilter.value;
			let sub = this.emailService.getAllActiveClients(this.uiState.filters).subscribe((res: HttpResponse<IBaseResponse<IEmailClient[]>>) => {
				if (res.body?.status) {
					this.uiState.clients.list = res.body?.data!;
					params.successCallback(this.uiState.clients.list, this.uiState.clients.list.length);
				} else this.message.popup("Oops!", res.body?.message!, "error");
				this.uiState.gridReady = true;
				this.eventService.broadcast(reserved.isLoading, false);
				this.gridApi.hideOverlay();
			});
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
		this.uiState.showClientSearch = true;
		this.uiState.showSelectContact = true;
		this.uiState.selectedClientSno = params.data.sNo;
		this.clientIDFilter.patchValue(params.data.sNo);
		this.clientNameFilter.patchValue(params.data.fullName);
		this.clientInfo.patchValue(`${params.data.sNo} | ${params.data.fullName}`);
	}

	onGridReady(param: GridReadyEvent) {
		this.gridApi = param.api;
		if ((this, this.uiState.clients.list.length > 0)) this.gridApi.sizeColumnsToFit();
	}
	//#endregion

	//#region Contacts Grid
	contactsDataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			if (this.uiState.contacts.list.length == 0) this.eventService.broadcast(reserved.isLoading, true);
			else this.gridApi.showLoadingOverlay();
			console.log(this.uiState.selectedClientSno);
			let sub = this.emailService
				.getAllClientContacts(this.uiState.selectedClientSno)
				.subscribe((res: HttpResponse<IBaseResponse<IEmailClientContact[]>>) => {
					if (res.body?.status) {
						this.uiState.contacts.list = res.body?.data!;
						params.successCallback(this.uiState.contacts.list, this.uiState.contacts.list.length);
					} else this.message.popup("Oops!", res.body?.message!, "error");
					this.uiState.gridReady = true;
					this.eventService.broadcast(reserved.isLoading, false);
					this.gridApi.hideOverlay();
				});
			this.subscribes.push(sub);
		},
	};

	onSortContacts(e: GridReadyEvent) {
		let colState = e.columnApi.getColumnState();
		colState.forEach((el) => {
			if (el.sort) {
				this.uiState.Contactsilters.orderBy = el.colId!;
				this.uiState.Contactsilters.orderDir = el.sort!;
			}
		});
	}

	onCellClickedContacts(params: CellEvent) {
		if (params.column.getColId() == "action") {
			params.api.getCellRendererInstances({
				rowNodes: [params.node],
				columns: [params.column],
			});
		}
	}

	onGridReadyContacts(param: GridReadyEvent) {
		this.contactsGridApi = param.api;
		this.contactsGridApi.setDatasource(this.contactsDataSource);
		if ((this, this.uiState.contacts.list.length > 0)) this.contactsGridApi.sizeColumnsToFit();
	}
	//#endregion

	contactAddedSuccess(e: boolean) {
		console.log(e);
		this.uiState.showAddContact = false;
		this.uiState.showSelectContact = true;
		this.contactsGridApi.setDatasource(this.contactsDataSource);
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
