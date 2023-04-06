import { HttpResponse } from "@angular/common/http";
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { Subscription } from "rxjs";
import { Caching, IGenericResponseType } from "src/app/core/models/masterTableModels";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { emailCompanyCols } from "src/app/shared/app/grid/emailCompanyCols";
import { emailCompanyContactsCols } from "src/app/shared/app/grid/emailCompanyContactCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IEmailClientContact, IEmailCompanyContact } from "src/app/shared/app/models/Email/email-utils";
import { EmailService } from "src/app/shared/services/emails/email.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { EmailModalComponent } from "../email-modal/email-modal.component";

@Component({
	selector: "app-company-contacts",
	templateUrl: "./company-contacts.component.html",
	styleUrls: ["./company-contacts.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class CompanyContactsComponent implements OnInit, OnDestroy {
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
		ContactsFilters: {
			orderBy: "so",
			orderDir: "asc",
		} as IEmailClientContact,
		gridReady: false,
		submitted: false,
		showCopmanies: false,
		showSelectContact: false,
		showAddContact: false,
		selectedCompanySno: 0,
		selectedCompanyName: "",
		companies: {
			list: [] as any[],
		},
		contacts: {
			list: [] as IEmailCompanyContact[],
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
		columnDefs: emailCompanyCols,
		suppressCsvExport: true,
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
	};

	contactsGridOpts: GridOptions = {
		pagination: true,
		rowModelType: "infinite",
		editType: "fullRow",
		animateRows: true,
		columnDefs: emailCompanyContactsCols,
		context: { comp: this.emailModalInstance },
		suppressCsvExport: true,
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			sortable: true,
			resizable: true,
		},
		overlayNoRowsTemplate: "<alert class='alert alert-secondary'>No Data To Show</alert>",
		onGridReady: (e) => this.onGridReadyContacts(e),
		onCellClicked: (e) => this.onCellClickedContacts(e),
		onSortChanged: (e) => this.onSortContacts(e),
	};

	constructor(private eventService: EventService, private emailService: EmailService, private message: MessagesService) {}

	ngOnInit(): void {
		this.contactsGridOpts.context = { comp: this.emailModalInstance };
	}

	goBack() {
		this.emailModalInstance.uiState.modalBody.email = true;
		this.emailModalInstance.uiState.modalBody.insuranceCompanyContact = false;
	}

	//#region Insurance companies Grid
	dataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			if (this.uiState.companies.list.length == 0) this.eventService.broadcast(reserved.isLoading, true);
			else this.gridApi.showLoadingOverlay();
			let sub = this.emailService.getAllCompanies().subscribe((res: IBaseResponse<Caching<IGenericResponseType[]>>) => {
				if (res.status) {
					this.uiState.companies.list = res.data!.content;
					params.successCallback(this.uiState.companies.list, this.uiState.companies.list.length);
					if (this.uiState.companies.list.length === 0) this.gridApi.showNoRowsOverlay();
					else this.gridApi.hideOverlay();
				} else {
					this.message.popup("Oops!", res.message!, "error");
					this.uiState.gridReady = true;
					this.gridApi.hideOverlay();
				}
				this.eventService.broadcast(reserved.isLoading, false);
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
		this.uiState.showCopmanies = true;
		this.uiState.showSelectContact = true;
		this.uiState.selectedCompanySno = params.data.id;
		this.uiState.selectedCompanyName = params.data.name;
	}

	onGridReady(param: GridReadyEvent) {
		this.gridApi = param.api;
		this.gridApi.setDatasource(this.dataSource);
		if (this.uiState.companies.list.length > 0) this.gridApi.sizeColumnsToFit();
	}
	//#endregion

	//#region Contacts Grid
	contactsDataSource: IDatasource = {
		getRows: (params: IGetRowsParams) => {
			if (this.uiState.contacts.list.length == 0) this.eventService.broadcast(reserved.isLoading, true);
			else this.contactsGridApi.showLoadingOverlay();
			let sub = this.emailService
				.getAllCompanyContacts(this.uiState.selectedCompanySno)
				.subscribe((res: HttpResponse<IBaseResponse<IEmailCompanyContact[]>>) => {
					if (res.body?.status) {
						this.uiState.contacts.list = res.body?.data!;
						params.successCallback(this.uiState.contacts.list, this.uiState.contacts.list.length);
						if (this.uiState.contacts.list.length === 0) this.contactsGridApi.showNoRowsOverlay();
						else this.contactsGridApi.hideOverlay();
					} else {
						this.message.popup("Oops!", res.body?.message!, "error");
						this.contactsGridApi.hideOverlay();
					}
					this.uiState.gridReady = true;
					this.eventService.broadcast(reserved.isLoading, false);
				});
			this.subscribes.push(sub);
		},
	};

	onSortContacts(e: GridReadyEvent) {
		let colState = e.columnApi.getColumnState();
		colState.forEach((el) => {
			if (el.sort) {
				this.uiState.ContactsFilters.orderBy = el.colId!;
				this.uiState.ContactsFilters.orderDir = el.sort!;
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
		if (this.uiState.contacts.list.length > 0) this.contactsGridApi.sizeColumnsToFit();
	}
	//#endregion

	contactAddedSuccess(e: boolean) {
		this.uiState.showAddContact = false;
		this.uiState.showSelectContact = true;
		this.contactsGridApi.setDatasource(this.contactsDataSource);
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
